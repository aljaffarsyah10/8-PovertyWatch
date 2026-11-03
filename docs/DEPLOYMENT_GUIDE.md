# PovertyWatch — Production Deployment Guide

**Dokumen:** `docs/DEPLOYMENT_GUIDE.md`  
**Phase:** Phase 10 — Production Deployment & Release  
**Versi Produk:** `1.0.0` (Production MVP)  
**Target Lingkungan:** VPS Linux (Ubuntu 22.04 / 24.04 LTS) + Docker Compose + Nginx + PostgreSQL 16  

---

## 1. Spesifikasi Infrastruktur Minimum & Rekomendasi

| Parameter | Spesifikasi Minimum | Rekomendasi Production |
| :--- | :--- | :--- |
| **Sistem Operasi** | Ubuntu Server 22.04 LTS (x86_64) | Ubuntu Server 24.04 LTS (x86_64) |
| **CPU Core** | 2 vCPU | 4 vCPU |
| **RAM** | 2 GB (dengan Swap 2 GB) | 4 GB |
| **Penyimpanan (Disk)** | 20 GB NVMe / SSD | 50 GB NVMe SSD |
| **Jaringan** | 100 Mbps, IP Publik Statis IPv4 | 1 Gbps, Port 80 & 443 terbuka |
| **Container Engine** | Docker Engine 24.x+ & Compose Plugin v2.x | Docker Engine 27.x+ |

---

## 2. Topologi Arsitektur Deployment

```
                    INTERNET (Pengguna & Operator)
                                  │
                                  ▼ (Port 80 HTTP -> 301 Redirect)
                                  ▼ (Port 443 HTTPS / TLS 1.3)
                    ┌───────────────────────────┐
                    │       Nginx Proxy         │
                    │  (Rate Limit, SSL, Gzip)  │
                    └─────────────┬─────────────┘
                                  │ (Internal Bridge Network)
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                              ┌──────────────────┐
│  Next.js (app)   │                              │  Worker Service  │
│ Port 3000 (HTTP) │                              │ Node-Cron Ingest │
│   Web UI & API   │                              │  Scheduled Jobs  │
└────────┬─────────┘                              └────────┬─────────┘
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  │ (Internal Only - Port 5432)
                                  ▼
                    ┌───────────────────────────┐
                    │      PostgreSQL (db)      │
                    │  Database: povertywatch   │
                    │  Volume: postgres_data    │
                    └───────────────────────────┘
```

> [!IMPORTANT]
> Port database PostgreSQL (`5432`) **tidak diekspos ke internet publik**. Komunikasi antara aplikasi Next.js, worker scraper, dan database sepenuhnya berjalan di dalam jaringan virtual terisolasi Docker (`povertywatch_internal`).

---

## 3. Konfigurasi Environment (`.env.production`)

Salin berkas template [`.env.production.example`](file:///d:/10Project/8-PovertyWatch/.env.production.example) menjadi `.env.production`:

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Daftar variabel kunci yang wajib diisi:
- `NODE_ENV`: Wajib bernilai `production`.
- `NEXT_PUBLIC_APP_URL`: URL kanonikal produksi (misal: `https://povertywatch.id`).
- `POSTGRES_USER`: Nama pengguna database (default: `povertywatch`).
- `POSTGRES_PASSWORD`: Kata sandi kuat (minimal 24 karakter acak).
- `POSTGRES_DB`: Nama database (default: `povertywatch`).
- `DATABASE_URL`: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}`.
- `ADMIN_SESSION_SECRET`: String hex acak 64 karakter (buat dengan `openssl rand -hex 32`).
- `SCRAPER_USER_AGENT`: User agent sopan bot scraper (`PovertyWatch-Bot/1.0 (+https://povertywatch.id/about-bot)`).
- `SCRAPER_CRON_SCHEDULE`: Jadwal otomatis cron (default: `"0 6 * * *"` untuk eksekusi harian pukul 06:00 WIB).

---

## 4. Konfigurasi Domain & DNS

Arahkan DNS Record pada penyedia domain Anda:
- `A Record` : `@` -> `<IP_PUBLIK_VPS>`
- `A Record` : `www` -> `<IP_PUBLIK_VPS>`
- TTL: 300 (5 menit untuk propagasi cepat)

---

## 5. Langkah-Langkah Deployment Produksi

### Langkah 1: Persiapan Server & Instalasi Docker
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw ca-certificates gnupg

# Konfigurasi Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install Docker Engine & Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Langkah 2: Clone Repository & Konfigurasi Secret
```bash
git clone https://github.com/your-org/povertywatch.git /opt/povertywatch
cd /opt/povertywatch

cp .env.production.example .env.production
nano .env.production
```

### Langkah 3: Perolehan Sertifikat SSL (Let's Encrypt Certbot)
Untuk inisialisasi awal sertifikat:
```bash
# Buat direktori certbot
mkdir -p certbot/conf certbot/www

# Dapatkan sertifikat via standalone temporary atau webroot
sudo docker run -it --rm --name certbot \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d povertywatch.id -d www.povertywatch.id \
  --email admin@povertywatch.id --agree-tos --no-eff-email
```

### Langkah 4: Migrasi Basis Data & Inisialisasi Seed
```bash
# Jalankan migrasi schema Prisma ke database production
docker compose --env-file .env.production run --rm app npx prisma migrate deploy

# Isi kategori taksonomi awal dan sumber berita resmi Kota Medan
docker compose --env-file .env.production run --rm app npm run seed
```

### Langkah 5: Menjalankan Seluruh Layanan
```bash
# Build dan aktifkan container di background
docker compose --env-file .env.production up -d --build

# Periksa status kontainer
docker compose ps
```

---

## 6. Prosedur Pemantauan (*Monitoring & Health Checks*)

1. **Pemeriksaan Kontainer:**
   ```bash
   docker compose ps
   # Pastikan seluruh service berstatus 'Up' atau 'healthy'
   ```
2. **Log Aplikasi Real-time:**
   ```bash
   # Log Web Application
   docker compose logs -f --tail=100 app

   # Log Background Scraper Worker
   docker compose logs -f --tail=100 worker

   # Log Database PostgreSQL
   docker compose logs -f --tail=50 db
   ```
3. **Endpoint Health Check:**
   - Web: `curl -I https://povertywatch.id`
   - API Sources Health: `curl -s https://povertywatch.id/api/sources/health | jq .`
   - API Trends: `curl -s https://povertywatch.id/api/dashboard/trends | jq .`

---

## 7. Prosedur Pencadangan (*Backup*) & Pemulihan (*Restore*)

### Otomatisasi Backup Harian (Cron Host)
Tambahkan ke crontab server host (`crontab -e`):
```cron
# Backup database PovertyWatch setiap hari pukul 02:00 WIB
0 2 * * * /opt/povertywatch/scripts/backup.sh >> /var/log/povertywatch_backup.log 2>&1
```

### Eksekusi Backup Manual
```bash
./scripts/backup.sh
# Berkas cadangan otomatis terkompresi di: /var/backups/povertywatch/povertywatch_db_YYYYMMDD_HHMMSS.sql.gz
```

### Prosedur Restore Basis Data
```bash
./scripts/restore.sh /var/backups/povertywatch/povertywatch_db_20261104_020000.sql.gz
```

---

## 8. Strategi Rollback (*Emergency Rollback Plan*)

Jika terjadi kendala kritis setelah deployment versi baru:
```bash
# 1. Revert commit Git ke versi stabil sebelumnya
git reset --hard <PREVIOUS_STABLE_COMMIT_SHA>

# 2. Re-build dan start container sebelumnya
docker compose --env-file .env.production up -d --build

# 3. Jika migrasi database perlu di-rollback, pulihkan backup database sebelum rilis:
./scripts/restore.sh /var/backups/povertywatch/pre_release_backup.sql.gz
```
