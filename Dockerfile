# Gunakan image resmi Python yang ringan
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set working directory di dalam container
WORKDIR /app

# Install system dependencies yang dibutuhkan untuk OpenCV dan Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt dan install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh file project ke dalam container
COPY . .

# Expose port yang digunakan oleh FastAPI
EXPOSE 8000

# Jalankan server FastAPI menggunakan uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
