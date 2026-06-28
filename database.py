import mysql.connector
from mysql.connector import Error
import sqlite3
import os
import hashlib
import secrets
from datetime import datetime

# Konfigurasi MySQL default
MYSQL_HOST = "127.0.0.1"
MYSQL_USER = "root"
MYSQL_PASSWORD = ""
MYSQL_DATABASE = "cabai_db"

USE_SQLITE = False
SQLITE_FILE = "cabai_db.sqlite"

# ==========================================
# FUNGSI UTILITY KEAMANAN & PASSWORD HASHING
# ==========================================

def hash_password(password: str) -> str:
    """Melakukan hashing password menggunakan PBKDF2 HMAC SHA256 bawaan Python"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        100000
    ).hex()
    return f"{salt}:{pwd_hash}"

def verify_password(password: str, hashed_str: str) -> bool:
    """Memverifikasi kecocokan password dengan hash yang tersimpan"""
    try:
        salt, pwd_hash = hashed_str.split(":")
        calc_hash = hashlib.pbkdf2_hmac(
            'sha256', 
            password.encode('utf-8'), 
            salt.encode('utf-8'), 
            100000
        ).hex()
        return secrets.compare_digest(pwd_hash, calc_hash)
    except Exception:
        return False

def generate_session_token() -> str:
    """Menghasilkan token sesi acak yang aman"""
    return secrets.token_urlsafe(32)

# ==========================================
# KONEKSI DATABASE
# ==========================================

def get_mysql_connection(select_db=True):
    """Mencoba membuat koneksi ke MySQL"""
    try:
        if select_db:
            conn = mysql.connector.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DATABASE
            )
        else:
            conn = mysql.connector.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD
            )
        return conn, None
    except Error as e:
        return None, e

def get_sqlite_connection():
    """Membuat koneksi ke SQLite"""
    try:
        conn = sqlite3.connect(SQLITE_FILE, check_same_thread=False)
        return conn, None
    except Exception as e:
        return None, e

def init_db():
    """Menginisialisasi database dan tabel yang dibutuhkan"""
    global USE_SQLITE
    
    # 1. Coba inisialisasi MySQL terlebih dahulu
    conn, err = get_mysql_connection(select_db=False)
    if conn:
        try:
            cursor = conn.cursor()
            # Buat database jika belum ada
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
            cursor.close()
            conn.close()
            
            # Hubungkan kembali dengan database terpilih
            conn, err = get_mysql_connection(select_db=True)
            if conn:
                cursor = conn.cursor()
                # Create users table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(100) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        created_at DATETIME NOT NULL
                    )
                """)
                # Create sessions table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS sessions (
                        token VARCHAR(255) PRIMARY KEY,
                        user_id INT NOT NULL,
                        created_at DATETIME NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                """)
                # Create prediksi table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS prediksi (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NULL,
                        nama_file VARCHAR(255) NOT NULL,
                        hasil_prediksi VARCHAR(50) NOT NULL,
                        confidence_score FLOAT NOT NULL,
                        tanggal_prediksi DATETIME NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                    )
                """)
                # Coba tambah kolom user_id jika sebelumnya tabel sudah ada
                try:
                    cursor.execute("ALTER TABLE prediksi ADD COLUMN user_id INT NULL AFTER id")
                    cursor.execute("ALTER TABLE prediksi ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL")
                except Error:
                    pass
                conn.commit()
                cursor.close()
                conn.close()
                print("Database MySQL diinisialisasi dengan sukses.")
                return "mysql", None
        except Error as e:
            print(f"Error saat konfigurasi database MySQL: {e}")
            err = e
            
    # 2. Jika MySQL gagal, gunakan SQLite sebagai fallback
    print("Gagal menggunakan MySQL. Mengaktifkan fallback SQLite...")
    USE_SQLITE = True
    conn, err_sqlite = get_sqlite_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("PRAGMA foreign_keys = ON")
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP NOT NULL
                )
            """)
            # Create sessions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    token TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    created_at TIMESTAMP NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            # Create prediksi table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS prediksi (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    nama_file TEXT NOT NULL,
                    hasil_prediksi TEXT NOT NULL,
                    confidence_score REAL NOT NULL,
                    tanggal_prediksi TIMESTAMP NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                )
            """)
            # Coba tambah kolom user_id jika sebelumnya tabel sudah ada
            try:
                cursor.execute("ALTER TABLE prediksi ADD COLUMN user_id INTEGER")
            except Exception:
                pass
            conn.commit()
            conn.close()
            print("Database SQLite diinisialisasi dengan sukses.")
            return "sqlite", None
        except Exception as e:
            return "none", e
            
    return "none", err

# ==========================================
# OPERASI AUTENTIKASI PENGGUNA
# ==========================================

def register_user(username, password):
    """Mendaftarkan user baru ke database"""
    global USE_SQLITE
    username = username.strip()
    hashed_pwd = hash_password(password)
    created_at = datetime.now()
    
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return False, err
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
                (username, hashed_pwd, created_at)
            )
            conn.commit()
            conn.close()
            return True, None
        except sqlite3.IntegrityError:
            return False, "Username sudah digunakan."
        except Exception as e:
            return False, e
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            return False, err
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password_hash, created_at) VALUES (%s, %s, %s)",
                (username, hashed_pwd, created_at)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return True, None
        except mysql.connector.IntegrityError:
            return False, "Username sudah digunakan."
        except Error as e:
            return False, e

def authenticate_user(username, password):
    """Memverifikasi login dan mengembalikan token sesi baru jika sukses"""
    global USE_SQLITE
    username = username.strip()
    
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return None, err
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, password_hash FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                return None, "Username atau password salah."
                
            user_id, stored_hash = row
            if not verify_password(password, stored_hash):
                conn.close()
                return None, "Username atau password salah."
                
            # Generate session token
            token = generate_session_token()
            cursor.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
                (token, user_id, datetime.now())
            )
            conn.commit()
            conn.close()
            return token, None
        except Exception as e:
            return None, e
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            return None, err
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, password_hash FROM users WHERE username = %s", (username,))
            row = cursor.fetchone()
            if not row:
                cursor.close()
                conn.close()
                return None, "Username atau password salah."
                
            user_id, stored_hash = row
            if not verify_password(password, stored_hash):
                cursor.close()
                conn.close()
                return None, "Username atau password salah."
                
            # Generate session token
            token = generate_session_token()
            cursor.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (%s, %s, %s)",
                (token, user_id, datetime.now())
            )
            conn.commit()
            cursor.close()
            conn.close()
            return token, None
        except Error as e:
            return None, e

def verify_session(token):
    """Memverifikasi token sesi dan mengembalikan (user_id, username)"""
    global USE_SQLITE
    if not token:
        return None, None
        
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return None, None
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT users.id, users.username FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token = ?", 
                (token,)
            )
            row = cursor.fetchone()
            conn.close()
            if row:
                return row[0], row[1]
            return None, None
        except Exception:
            return None, None
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            return None, None
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT users.id, users.username FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token = %s", 
                (token,)
            )
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            if row:
                return row[0], row[1]
            return None, None
        except Error:
            return None, None

def delete_session(token):
    """Menghapus token sesi (logout)"""
    global USE_SQLITE
    if not token:
        return False
        
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return False
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
            conn.commit()
            conn.close()
            return True
        except Exception:
            return False
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            return False
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM sessions WHERE token = %s", (token,))
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Error:
            return False

# ==========================================
# OPERASI RIWAYAT PREDIKSI
# ==========================================

def save_prediction(nama_file, hasil_prediksi, confidence_score, user_id=None):
    """Menyimpan hasil prediksi ke database (bisa dikaitkan ke user_id atau None untuk guest)"""
    global USE_SQLITE
    tanggal_sekarang = datetime.now()
    
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return False, err
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO prediksi (user_id, nama_file, hasil_prediksi, confidence_score, tanggal_prediksi) VALUES (?, ?, ?, ?, ?)",
                (user_id, nama_file, hasil_prediksi, float(confidence_score), tanggal_sekarang)
            )
            conn.commit()
            conn.close()
            return True, None
        except Exception as e:
            return False, e
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            # Jika tiba-tiba MySQL mati, coba simpan ke SQLite
            print("Koneksi MySQL terputus. Mencoba beralih ke SQLite untuk menyimpan...")
            USE_SQLITE = True
            init_db()
            return save_prediction(nama_file, hasil_prediksi, confidence_score, user_id)
            
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO prediksi (user_id, nama_file, hasil_prediksi, confidence_score, tanggal_prediksi) VALUES (%s, %s, %s, %s, %s)",
                (user_id, nama_file, hasil_prediksi, float(confidence_score), tanggal_sekarang)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return True, None
        except Error as e:
            return False, e

def get_prediction_history(user_id="all"):
    """Mengambil riwayat prediksi berdasarkan user_id. 
    Jika user_id adalah 'all', mengambil semua. 
    Jika user_id adalah None, mengambil riwayat guest (user_id IS NULL)"""
    global USE_SQLITE
    
    query = "SELECT id, user_id, nama_file, hasil_prediksi, confidence_score, tanggal_prediksi FROM prediksi"
    params = ()
    
    if user_id == "all":
        query += " ORDER BY tanggal_prediksi DESC"
    elif user_id is None:
        query += " WHERE user_id IS NULL ORDER BY tanggal_prediksi DESC"
    else:
        query += " WHERE user_id = ? ORDER BY tanggal_prediksi DESC" if USE_SQLITE else " WHERE user_id = %s ORDER BY tanggal_prediksi DESC"
        params = (user_id,)
        
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return [], err
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            conn.close()
            
            history = []
            for row in rows:
                history.append({
                    'id': row[0],
                    'user_id': row[1],
                    'nama_file': row[2],
                    'hasil_prediksi': row[3],
                    'confidence_score': row[4],
                    'tanggal_prediksi': row[5]
                })
            return history, None
        except Exception as e:
            return [], e
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            # Jika MySQL mati saat fetching, coba beralih ke SQLite
            print("Koneksi MySQL terputus saat membaca riwayat. Beralih ke SQLite...")
            USE_SQLITE = True
            init_db()
            return get_prediction_history(user_id)
            
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            cursor.close()
            conn.close()
            
            history = []
            for row in rows:
                history.append({
                    'id': row[0],
                    'user_id': row[1],
                    'nama_file': row[2],
                    'hasil_prediksi': row[3],
                    'confidence_score': row[4],
                    'tanggal_prediksi': row[5]
                })
            return history, None
        except Error as e:
            return [], e

def delete_prediction(prediction_id):
    """Menghapus data riwayat berdasarkan ID"""
    global USE_SQLITE
    
    if USE_SQLITE:
        conn, err = get_sqlite_connection()
        if not conn:
            return False, err
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM prediksi WHERE id = ?", (prediction_id,))
            conn.commit()
            conn.close()
            return True, None
        except Exception as e:
            return False, e
    else:
        conn, err = get_mysql_connection(select_db=True)
        if not conn:
            return False, err
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM prediksi WHERE id = %s", (prediction_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return True, None
        except Error as e:
            return False, e
