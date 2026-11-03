#!/usr/bin/env bash
# ==============================================================================
# POVERTYWATCH DATABASE BACKUP SCRIPT
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/povertywatch}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/povertywatch_db_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "📦 Memulai backup basis data PostgreSQL PovertyWatch..."

# Jalankan pg_dump di dalam container database
docker compose exec -T db pg_dump -U povertywatch povertywatch | gzip > "${BACKUP_FILE}"

# Verifikasi integritas berkas backup
if [ -s "${BACKUP_FILE}" ]; then
    FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "✅ Backup berhasil disimpan: ${BACKUP_FILE} (Ukuran: ${FILE_SIZE})"
else
    echo "❌ Backup gagal atau berkas kosong!"
    rm -f "${BACKUP_FILE}"
    exit 1
fi

# Rotasi backup: Hapus berkas yang lebih lama dari 30 hari
echo "🧹 Membersihkan cadangan kadaluarsa (> 30 hari)..."
find "${BACKUP_DIR}" -type f -name "povertywatch_db_*.sql.gz" -mtime +30 -delete
echo "✨ Pemeliharaan backup selesai."

