#!/bin/bash

# ==========================================
# GANTI LINK DI BAWAH DENGAN LINK REPO KAMU
# ==========================================
REPO_URL="https://github.com/fadhilraisw/Web-Portofolio.git"

echo "🚀 Memulai proses sinkronisasi ke GitHub..."

# 1. Inisialisasi Git (Aman meskipun sudah diinisialisasi sebelumnya)
git init

# 2. Menambahkan semua perubahan ke staging
echo "📦 Menambahkan file..."
git add .

# 3. Meminta input untuk pesan commit
read -p "💬 Masukkan pesan commit (tekan Enter untuk default 'Update dari lokal'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Update dari lokal"}

# 4. Melakukan Commit
git commit -m "$COMMIT_MSG"

# 5. Memastikan branch utama bernama 'main'
git branch -M main

# 6. Set remote URL (Bisa untuk tambah baru atau update yang sudah ada)
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# 7. Push ke GitHub
echo "☁️ Mengunggah kode ke GitHub..."
git push -u origin main

echo "✅ Selesai! Kode kamu aman di awan."