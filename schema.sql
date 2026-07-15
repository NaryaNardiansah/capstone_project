CREATE DATABASE IF NOT EXISTS cabai_db;
USE cabai_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prediksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    nama_file VARCHAR(255) NOT NULL,
    hasil_prediksi VARCHAR(50) NOT NULL,
    confidence_score FLOAT NOT NULL,
    tanggal_prediksi DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
