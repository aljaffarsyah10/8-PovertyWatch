#!/usr/bin/env bash
# ==============================================================================
# POVERTYWATCH DATABASE RESTORE SCRIPT
# ==============================================================================
set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Penggunaan: $0 <path-to-backup-file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ Error: Berkas cadangan '${BACKUP_FILE}' tidak ditemukan!"
    exit 1
fi

echo "⚠️ PERINGATAN: Memulihkan database akan menimpa seluruh data yang ada!"
read -p "Ketik 'YA' untuk melanjutkan proses restore: " CONFIRM

if [ "${CONFIRM}" != "YA" ]; then
    echo "Operasi restore dibatalkan."
    exit 0
fi

echo "🔄 Menghentikan sementara worker & app..."
docker compose stop app worker

echo "📥 Memulihkan data dari ${BACKUP_FILE} ke PostgreSQL..."
gunzip -c "${BACKUP_FILE}" | docker compose exec -T db psql -U povertywatch -d povertywatch

echo "▶️ Menjalankan kembali aplikasi & worker..."
docker compose start app worker

echo "✅ Pemulihan basis data selesai dan terverifikasi."
