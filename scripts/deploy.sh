#!/usr/bin/env bash
# ==============================================================================
# POVERTYWATCH PRODUCTION DEPLOYMENT SCRIPT
# ==============================================================================
set -euo pipefail

echo "========================================================"
echo "🚀 POVERTYWATCH PRODUCTION DEPLOYMENT STARTING"
echo "========================================================"

# 1. Pastikan file .env.production ada
if [ ! -f .env.production ]; then
    echo "❌ Error: File .env.production tidak ditemukan!"
    echo "Silakan salin .env.production.example ke .env.production dan isi kredensial."
    exit 1
fi

echo "📦 [1/5] Memperbarui kode sumber dari repository Git..."
git fetch origin master
git reset --hard origin/master

echo "🏗️ [2/5] Membangun container Docker..."
docker compose --env-file .env.production build --no-cache

echo "🗄️ [3/5] Menjalankan migrasi basis data Prisma..."
docker compose --env-file .env.production run --rm app npx prisma migrate deploy

echo "🔄 [4/5] Mengaktifkan layanan aplikasi & background worker..."
docker compose --env-file .env.production up -d --remove-orphans

echo "🩺 [5/5] Memeriksa status kesehatan container..."
sleep 5
docker compose --env-file .env.production ps

echo "========================================================"
echo "🎉 DEPLOYMENT SELESAI DENGAN SUKSES!"
echo "Situs aktif di: https://povertywatch.id"
echo "========================================================"
