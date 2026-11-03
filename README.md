# PovertyWatch (Kota Medan)

> **Monitoring Poverty, Understanding Local Realities.**  
> Platform Pemantauan Digital Fenomena Sosial Ekonomi dan Isu Kemiskinan Berbasis Media Daring Lokal Kota Medan.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

---

## 📌 Tentang Proyek

**PovertyWatch** adalah aplikasi web *Modular Monolith* yang secara otomatis menghimpun, menormalisasi, menyaring, mengklasifikasikan, dan menganalisis artikel berita dari berbagai portal media massa daring publik di wilayah **Kota Medan**, Sumatera Utara.

Platform ini bertujuan mengubah liputan media yang tersebar tidak terstruktur menjadi dataset terstruktur dan transparan untuk:
1. Memantau atensi publik terhadap fenomena sosial ekonomi masyarakat.
2. Memetakan persebaran isu per kecamatan dan kelurahan di Kota Medan.
3. Menyediakan data rujukan awal bagi advokasi kebijakan sosial, jurnalisme data, dan penelitian independen.

---

## ✨ Fitur-Fitur Utama

- **📊 Dashboard Pemantauan Interaktif:**
  - Metrik statistik real-time: Total Berita, Berita 24 Jam Terakhir, Sumber Aktif, dan Tingkat Keberhasilan Scraper.
  - Grafik distribusi 8 kategori isu kemiskinan.
  - Dinamika tren publikasi mingguan (8 minggu terakhir) dengan indikator pertumbuhan/penurunan perbandingan periode 30 hari.
  - Sebaran wilayah kecamatan (*hotspot*) yang paling sering diberitakan di Kota Medan.
- **📰 News Explorer & Filter Multi-Dimensi:**
  - Pencarian cepat teks lengkap (*title*, *description*, *location*).
  - Filter menurut 8 Kategori Fenomena, Sumber Portal Berita, dan 21 Wilayah Kecamatan Kota Medan.
  - Tampilan fleksibel: Mode **Tabel Data** dan Mode **Kartu Berita (Grid)**.
  - Halaman detail berita (`/news/[id]`) dengan *Data Provenance Audit Trail* (ID Database dan Canonical Normalized URL).
- **🤖 Kecerdasan Buatan (AI) & NLP Terintegrasi:**
  - **AI Classification:** Klasifikasi otomatis ke 8 kategori kemiskinan dengan skor keyakinan (*confidence*) dan narasi alasan.
  - **AI Summary:** Intisari ringkas 2–4 kalimat Bahasa Indonesia formal yang menonjolkan aspek kemiskinan dan bantuan sosial.
  - **Resilient Fallback:** Jika LLM eksternal tidak tersedia/gagal, sistem mendegradasi otomatis ke rule-based NLP tanpa pernah menghentikan proses scraping.
- **📍 Ekstraksi Wilayah Cerdas:**
  - Deteksi otomatis hingga level **Kelurahan** (Sicanang, Bagan Deli, Kesawan, Titipapan, dll.) dan **Kecamatan** (21 Kecamatan Kota Medan) tanpa mengarang/halusinasi lokasi.
- **📥 Ekspor Data Multi-Format:**
  - **CSV (RFC-4180):** Untuk pengolahan data lanjutan dan analisis kuantitatif.
  - **Excel (XLSX):** Berkas workbook multi-sheet berisi data berita dan lembar *Metodologi & Disclaimer*.
  - **Laporan Dokumen PDF:** Format dokumen institusional rapi yang siap dicetak/dibagikan.
- **🛡️ Keamanan & Kepatuhan Data Tingkat Tinggi:**
  - **SSRF Guard:** Memblokir seluruh akses loopback (IPv4/IPv6), private subnet RFC 1918, cloud instance metadata (AWS/GCP), dan port layanan internal terbatas.
  - **Formula Injection Sanitization (CWE-1236):** Netralisasi otomatis sel CSV/Excel yang diawali karakter berbahaya (`=`, `+`, `-`, `@`, `\t`, `\r`, `\n`).
  - **Pembersihan XSS:** Naskah berita dibersihkan dari seluruh blok `<script>` dan atribut event handler sebelum disimpan.
- **⚙️ Scraping Engine & Background Worker Mandiri:**
  - Mendukung RSS/Atom Feed Ingestion dan HTML Scraper (CSS Selectors via Cheerio).
  - Protokol Anti-Duplikasi berbasis Normalized URL Hash unik.
  - Pemantauan kesehatan sumber berita (*Source Health Monitoring*) dengan status `HEALTHY`, `DEGRADED`, dan `FAILING`.
  - Halaman Audit Logs (`/scraping/logs`) untuk memantau jejak eksekusi worker secara mendalam.

---

## 🛠️ Tech Stack

- **Frontend & Server:** Next.js 16.4.4 (App Router, Turbopack, Partial Prerendering), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React, shadcn/ui
- **Database & ORM:** PostgreSQL 16, Prisma ORM 6.x
- **Ingestion & Scrapers:** `rss-parser`, `cheerio`
- **Scheduler & Background Worker:** `node-cron`, `tsx`
- **Generasi Dokumen:** `xlsx` (SheetJS), `pdfkit`
- **Validasi Data:** `zod`
- **Logging:** `pino`
- **Container & Deployment:** Docker, Docker Compose, Nginx Reverse Proxy (SSL/TLS)

---

## 📋 Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terpasang:
- **Node.js:** Versi 20.x LTS atau lebih baru
- **npm:** Versi 10.x atau lebih baru
- **PostgreSQL:** Versi 14, 15, atau 16 (Bisa PostgreSQL lokal, Docker, atau layanan cloud seperti Neon / Supabase)

---

## 🚀 Panduan Menjalankan Aplikasi (Lokal / Development)

### 1. Kloning Repository & Instalasi Dependencies
Buka terminal dan jalankan:
```bash
git clone https://github.com/your-username/povertywatch.git
cd povertywatch
npm install
```

### 2. Konfigurasi Environment Variables (`.env`)
Salin file template environment:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan koneksi database PostgreSQL Anda:
```env
# Koneksi Basis Data PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/povertywatch"

# Secret untuk sesi dan enkripsi (minimal 32 karakter)
ADMIN_SESSION_SECRET="kunci-rahasia-keamanan-povertywatch-lokal-medan"

# Identitas bot scraper yang sopan
SCRAPER_USER_AGENT="PovertyWatch-Bot/1.0 (+https://povertywatch.id)"

# Provider AI (Gunakan 'mock' untuk pengujian offline tanpa API key)
AI_PROVIDER="mock"
# OPENAI_API_KEY="" # Isi jika ingin menggunakan provider OpenAI/LLM nyata
```

### 3. Setup Basis Data & Data Awal (Seeding)
Terapkan skema tabel ke database dan jalankan seeding taksonomi 8 kategori kemiskinan serta portal berita lokal Kota Medan:
```bash
# Generate Prisma Client
npx prisma generate

# Terapkan skema tabel ke PostgreSQL
npx prisma db push

# Isi data awal (8 Kategori Kemiskinan & Sumber Media Medan)
npm run seed
```

### 4. Menjalankan Seluruh Pengujian Otomatis
Sebelum menyalakan server, Anda dapat memverifikasi seluruh modul sistem dengan menjalankan:
```bash
npm test
```
*Hasil yang diharapkan: 4 suite tes (Unit, E2E, Phase 8, Security QA) lulus 100% (24/24 passed).*

### 5. Menjalankan Web Application (Dashboard & News Explorer)
Jalankan development server Next.js:
```bash
npm run dev
```
Buka peramban Anda di: **`http://localhost:3000`**

### 6. (Opsional) Menjalankan Background Worker Scraper
Jika Anda ingin cron scheduler otomatis berjalan di latar belakang (mengambil berita secara terjadwal), buka **terminal baru** di folder proyek lalu jalankan:
```bash
npm run worker
```

> **Catatan:** Anda juga dapat memicu proses scraping manual kapan saja tanpa terminal worker melalui antarmuka web di menu **Scraping Monitor** (`http://localhost:3000/scraping`) dengan menekan tombol **"Jalankan Scrape Manual"**.

---

## 🧪 Validasi Kualitas Kode & Build

Untuk memastikan integritas kode sebelum commit atau deployment:
```bash
# 1. Pengecekan Type Safety TypeScript
npx tsc --noEmit

# 2. Pengecekan Standar Koding ESLint
npm run lint

# 3. Kompilasi Produksi Next.js
npm run build
```

---

## 🐳 Menjalankan dengan Docker Compose (Production Simulator)

PovertyWatch dilengkapi konfigurasi kontainer produksi siap pakai:

```bash
# 1. Siapkan environment produksi
cp .env.production.example .env.production
nano .env.production

# 2. Build dan aktifkan container (App, Worker, Database, Nginx)
docker compose --env-file .env.production up -d --build

# 3. Jalankan migrasi dan seeding di dalam container
docker compose --env-file .env.production run --rm app npx prisma migrate deploy
docker compose --env-file .env.production run --rm app npm run seed

# 4. Periksa status layanan
docker compose ps
```

---

## 📁 Struktur Direktori Proyek

```
8-PovertyWatch/
├── docs/                      # Dokumentasi komprehensif produk
│   ├── TECHNICAL_PLAN.md      # Arsitektur sistem & kontrak API
│   ├── UI_UX_GUIDE.md         # Panduan desain, warna, & wireframe
│   ├── TEST_REPORT.md         # Laporan pengujian QA & keamanan
│   ├── DEPLOYMENT_GUIDE.md    # Panduan deployment server produksi
│   └── RELEASE_NOTES.md       # Catatan rilis resmi v1.0.0
├── nginx/                     # Konfigurasi reverse proxy & TLS
├── prisma/                    # Skema Prisma & model relasi database
│   └── schema.prisma
├── scripts/                   # Skrip otomatisasi operasional
│   ├── seed.ts                # Idempotent database seeder
│   ├── deploy.sh              # Skrip deployment produksi
│   ├── backup.sh              # Skrip pencadangan PostgreSQL harian
│   └── restore.sh             # Skrip pemulihan database dari backup
├── src/
│   ├── app/                   # Next.js App Router (Pages & REST API)
│   │   ├── (dashboard)/       # Layout & halaman dashboard, news, sources, scraping
│   │   └── api/               # API route handlers (/news, /sources, /scraping, dll.)
│   ├── components/            # Komponen UI modular (Header, Sidebar, Badges, Tables)
│   ├── lib/                   # Utility umum, singleton Prisma DB, Logger
│   └── server/                # Logika inti backend
│       ├── ai/                # Abstraksi AI provider & mock/openai engine
│       ├── processors/        # Normalizer, Text Cleaner, Keyword Matcher, Location
│       ├── scrapers/          # Implementasi RSS parser & HTML cheerio scraper
│       └── security/          # SSRF Guard & Formula Injection Sanitizer
├── tests/                     # Suite pengujian unit, integrasi, dan keamanan
├── worker/                    # Background worker & cron scheduler mandiri
├── Dockerfile                 # Multi-stage production containerfile
├── docker-compose.yml         # Orkestrasi 4 layanan kontainer
└── package.json
```

---

## ⚠️ Batasan Metodologis & Disclaimer Resmi

> [!IMPORTANT]
> 1. **Bukan Data Statistik Resmi BPS:** Angka, grafik tren, dan visualisasi yang disajikan dalam PovertyWatch mencerminkan **volume dan frekuensi pemberitaan media massa daring**, bukan sensus resmi penduduk miskin atau angka kemiskinan makro dari Badan Pusat Statistik (BPS).
> 2. **Skor Keyakinan AI:** Skor confidence AI adalah estimasi heuristik pemrosesan bahasa alami untuk membantu pemetaan awal, bukan probabilitas statistik terkalibrasi matematis.
> 3. **Hak Cipta Konten:** PovertyWatch hanya menyimpan metadata, ringkasan singkat, dan kutipan intisari. Seluruh hak cipta artikel jurnalistik tetap dimiliki oleh masing-masing portal media berita terkait.

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi internal / privasi PovertyWatch. Hak cipta dilindungi undang-undang.
