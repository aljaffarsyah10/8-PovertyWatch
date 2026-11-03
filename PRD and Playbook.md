# POVERTYWATCH

## Product Requirements Document (PRD) & Sequential Development Playbook

# PovertyWatch

Monitoring Poverty, Understanding Local Realities.

MVP First

Web Application

AI-Assisted Development

PROJECT_PRD_AND_PLAYBOOK.md · Version 1.0 · 3 November 2026

Dokumen ini merupakan pedoman utama pengembangan PovertyWatch, mulai dari persiapan environment, perencanaan arsitektur, pengembangan frontend dan backend, implementasi news scraper, integrasi AI, pengujian, hingga deployment production.

Prinsip utama pengembangan:

1. News Scraper adalah fitur inti MVP.
2. Bangun produk yang benar-benar bisa digunakan, bukan sekadar dashboard dengan data dummy.
3. Utamakan pengumpulan berita yang terjadwal dan dapat ditelusuri.
4. Pisahkan proses scraping dari request-response web application.
5. Gunakan AI secara selektif untuk klasifikasi dan ringkasan, bukan untuk menggantikan proses scraping.
6. Jangan mengklaim hasil berita sebagai statistik resmi kemiskinan.
7. Setiap phase harus diselesaikan, diuji, dan disetujui sebelum melanjutkan phase berikutnya.

# PART A — PRODUCT REQUIREMENTS DOCUMENT (PRD)

# 1. Product Information

## 1.1 Product Identity

| Item                 | Description                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| Product Name         | PovertyWatch                                                                                        |
| Tagline              | Monitoring Poverty, Understanding Local Realities.                                                  |
| Product Type         | Micro-SaaS                                                                                          |
| Platform             | Web Application                                                                                     |
| Primary Market       | Indonesia                                                                                           |
| Initial Coverage     | Kota Medan, Sumatera Utara                                                                          |
| Future Coverage      | Kabupaten/Kota di Indonesia                                                                         |
| Target Users         | Publik, peneliti, mahasiswa, akademisi, pemerhati sosial, jurnalis, dan praktisi pembangunan daerah |
| Development Model    | Solo Developer                                                                                      |
| Development Approach | AI-Assisted Development / Vibe Coding                                                               |
| Release Strategy     | MVP First                                                                                           |
| Architecture         | Modular Monolith + Background Worker                                                                |

## 1.2 Product Description

PovertyWatch merupakan platform pemantauan fenomena sosial ekonomi berbasis berita dan informasi publik.

Platform ini mengumpulkan berita dari berbagai portal media online secara berkala, kemudian menyimpan, mengelola, dan mengorganisasikan berita tersebut menjadi informasi terstruktur yang dapat ditelusuri.

Berita yang dikumpulkan berfokus pada fenomena yang berkaitan dengan kemiskinan dan kondisi sosial ekonomi masyarakat, seperti:

- Kemiskinan ekstrem.
- Rumah tidak layak huni.
- Permukiman kumuh.
- Anak putus sekolah.
- Stunting dan gizi buruk.
- Pengangguran dan PHK.
- Kerawanan pangan.
- Permasalahan bantuan sosial.
- Dampak bencana terhadap kelompok rentan.

Pengguna dapat melihat hasil pengumpulan berita, melakukan pencarian, memfilter berdasarkan kategori dan lokasi, serta memantau perkembangan isu dari waktu ke waktu.

## 1.3 Development Stack

### Frontend

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| Next.js         | Web framework dan routing     |
| TypeScript      | Type safety                   |
| Tailwind CSS    | Styling                       |
| shadcn/ui       | UI components                 |
| Zustand         | Client state jika diperlukan  |
| React Hook Form | Form handling jika diperlukan |
| Zod             | Validation                    |

### Backend

| Technology             | Purpose                  |
| ---------------------- | ------------------------ |
| Next.js Route Handlers | REST API                 |
| TypeScript             | Backend application code |
| Prisma ORM             | Database access          |
| PostgreSQL             | Relational database      |
| Cheerio                | HTML parsing             |
| RSS Parser             | RSS/Atom feed parsing    |
| Axios / Native Fetch   | HTTP requests            |
| Pino                   | Structured logging       |

### Background Processing

| Technology     | Purpose                             |
| -------------- | ----------------------------------- |
| Node.js Worker | Scheduled scraping                  |
| node-cron      | Scheduling pada VPS                 |
| PostgreSQL     | Penyimpanan job dan status scraping |
| AI API         | Klasifikasi dan ringkasan opsional  |

### Infrastructure

| Technology     | Purpose                     |
| -------------- | --------------------------- |
| VPS            | Hosting aplikasi dan worker |
| Docker Compose | Deployment orchestration    |
| Nginx          | Reverse proxy               |
| Let's Encrypt  | HTTPS                       |
| PostgreSQL     | Production database         |

Keputusan arsitektur: Gunakan Next.js sebagai web application dan Node.js background worker sebagai proses terpisah dalam satu repository.

Tidak perlu menggunakan microservices, Kubernetes, Redis, atau message broker pada MVP.

## 1.4 Project Constraints

- Dikembangkan oleh satu developer.
- Menggunakan AI Coding Assistant.
- Fokus pada MVP yang berfungsi.
- Tidak mengimplementasikan sistem crawling berskala besar.
- Tidak menggunakan teknik bypass CAPTCHA atau anti-bot.
- Mengutamakan RSS feed dan sumber yang menyediakan akses publik.
- Menggunakan HTML scraping hanya jika diizinkan dan memungkinkan secara teknis.
- Tidak melakukan scraping terhadap konten yang memerlukan login.
- Tidak menyimpan seluruh isi artikel jika tidak memiliki izin.
- Tidak menjadikan hasil scraping sebagai statistik resmi kemiskinan.
- AI API tidak boleh menjadi dependency wajib untuk pengumpulan berita dasar.

# 2. Product Overview

## 2.1 Problem Statement

Informasi mengenai kondisi sosial ekonomi masyarakat tersebar di berbagai sumber digital.

Berita mengenai kemiskinan, bantuan sosial, kondisi perumahan, pendidikan, kesehatan, dan ketenagakerjaan biasanya dipublikasikan secara terpisah oleh berbagai media.

Permasalahan yang muncul:

1. Informasi tersebar di banyak portal berita.
2. Pengguna harus mencari berita secara manual.
3. Tidak tersedia pengelompokan berita berdasarkan fenomena sosial ekonomi.
4. Sulit mengetahui perkembangan isu dari waktu ke waktu.
5. Informasi lokasi kejadian tidak selalu terstruktur.
6. Sulit membuat dokumentasi hasil pemantauan secara konsisten.

## 2.2 Proposed Solution

PovertyWatch menyediakan satu platform terpusat untuk:

1. Mengumpulkan berita secara otomatis.
2. Menyimpan metadata berita.
3. Mengidentifikasi berita yang relevan dengan fenomena sosial ekonomi.
4. Mengelompokkan berita berdasarkan kategori.
5. Mengidentifikasi lokasi kejadian jika tersedia.
6. Menyediakan pencarian dan filter.
7. Menampilkan perkembangan jumlah berita dari waktu ke waktu.
8. Menyediakan ringkasan berita menggunakan AI sebagai fitur pendukung.

## 2.3 How It Works

## PovertyWatch Data Pipeline

1\. News Sources

Portal berita · RSS · Media online · Sumber publik

2\. Scheduled Scraper

RSS Fetching · HTML Parsing · Source Monitoring

3\. Data Processing

Normalization · Deduplication · Relevance Filtering

4\. AI Enrichment (Optional)

Classification · Summary · Location Extraction

5\. PostgreSQL Database

Structured News Records · Categories · Sources · Scraping Logs

6\. PovertyWatch Web Application

Dashboard · News Explorer · Filters · Monitoring · Reports

## 2.4 Product Value

PovertyWatch memberikan nilai berupa:

- Centralized Monitoring: Informasi berita terpusat.
- Structured Information: Berita dikategorikan secara sistematis.
- Local Context: Fokus pada fenomena sosial ekonomi Kota Medan.
- Historical Tracking: Informasi dapat ditelusuri berdasarkan tanggal.
- Research Support: Membantu penelusuran awal untuk analisis sosial ekonomi.
- Automation: Mengurangi aktivitas pencarian berita secara manual.

## 2.5 Important Data Interpretation

PovertyWatch harus membedakan tiga hal:

| Data                        | Meaning                                               |
| --------------------------- | ----------------------------------------------------- |
| News Count                  | Jumlah berita yang dikumpulkan                        |
| Reported Phenomena          | Fenomena yang diberitakan media                       |
| Official Poverty Statistics | Statistik resmi yang dipublikasikan lembaga berwenang |

Contoh:

Jika PovertyWatch menemukan 50 berita tentang kemiskinan di Medan, angka tersebut tidak berarti terdapat 50 kejadian kemiskinan atau 50 penduduk miskin.

Satu kejadian dapat diberitakan oleh beberapa media. Sebaliknya, banyak kejadian mungkin tidak pernah diberitakan.

Setiap dashboard dan laporan harus memberikan disclaimer yang sesuai.

# 3. Product Goals

## 3.1 Primary Goals

| ID    | Goal                           | Target MVP                              |
| ----- | ------------------------------ | --------------------------------------- |
| PG-01 | Otomatisasi pengumpulan berita | Scraping terjadwal berfungsi            |
| PG-02 | Pengelolaan sumber berita      | Minimal 5 sumber yang tervalidasi       |
| PG-03 | Pengumpulan berita relevan     | Berita tersimpan dan dapat ditelusuri   |
| PG-04 | Deduplication                  | URL dan artikel duplikat dapat dikenali |
| PG-05 | Monitoring                     | Statistik berita berdasarkan periode    |
| PG-06 | Search & Filter                | Pencarian dan filter berfungsi          |
| PG-07 | Data Export                    | Ekspor data berita ke CSV               |
| PG-08 | Reliability                    | Riwayat eksekusi scraper tersedia       |

Target di atas merupakan target pengembangan awal, bukan jaminan bahwa seluruh sumber akan menghasilkan volume berita tertentu.

## 3.2 Secondary Goals

- Klasifikasi fenomena menggunakan AI.
- Ringkasan berita otomatis.
- Ekstraksi lokasi kejadian.
- Analisis tren kategori.
- Ekspor laporan PDF dan Excel.

## 3.3 Product Non-Goals

MVP tidak bertujuan untuk:

- Menghitung jumlah penduduk miskin.
- Menggantikan statistik resmi BPS.
- Melakukan prediksi tingkat kemiskinan.
- Mengukur prevalensi stunting.
- Menggantikan sistem monitoring pemerintah.
- Melakukan crawling seluruh internet.
- Menyediakan sentiment analysis kompleks.
- Menggunakan computer vision untuk analisis gambar berita.

# 4. Target Users

## 4.1 Public Users

Pengguna umum yang ingin mengetahui perkembangan fenomena sosial ekonomi di Kota Medan.

Kebutuhan:

- Melihat berita terbaru.
- Menelusuri isu kemiskinan.
- Mencari berita berdasarkan kategori.
- Melihat lokasi kejadian.
- Membagikan sumber berita.

## 4.2 Researchers & Students

Mahasiswa, peneliti, dan akademisi.

Kebutuhan:

- Mengumpulkan referensi berita.
- Menemukan fenomena sosial.
- Menelusuri berita berdasarkan periode.
- Mengunduh data untuk penelitian awal.

## 4.3 Government & Public Sector Observers

ASN, pegawai pemerintah, dan pemerhati pembangunan daerah.

Kebutuhan:

- Memantau isu sosial ekonomi.
- Mengidentifikasi fenomena yang berkembang.
- Menyediakan bahan pendukung diskusi dan analisis.
- Mendokumentasikan informasi dari media.

PovertyWatch tidak boleh mengesankan bahwa data media merupakan data administratif pemerintah atau data statistik resmi.

## 4.4 Journalists & Social Observers

Kebutuhan:

- Memantau perkembangan berita.
- Menemukan isu yang sedang ramai.
- Menelusuri pemberitaan lintas media.

# 5. Scope & Feature Priorities

## 5.1 P0 — Core MVP

Wajib untuk MVP

| Feature                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| News Source Management | Mengelola sumber berita                                    |
| News Scraper           | Mengambil berita dari RSS dan website                      |
| Scheduled Scraping     | Menjalankan scraping secara terjadwal                      |
| Manual Scraping        | Menjalankan scraping secara manual                         |
| News Storage           | Menyimpan berita ke database                               |
| Deduplication          | Mencegah duplikasi berita                                  |
| Keyword Filtering      | Memfilter berita berdasarkan kata kunci                    |
| News Explorer          | Menampilkan seluruh berita                                 |
| Search & Filter        | Pencarian berdasarkan judul, kategori, tanggal, dan sumber |
| Scraping Logs          | Menampilkan riwayat eksekusi                               |
| Dashboard              | Menampilkan statistik dasar                                |
| CSV Export             | Mengekspor data berita                                     |

### Catatan Prioritas Scraper

News Scraper harus menjadi fokus utama pengembangan.

Sistem scraping harus bisa berfungsi tanpa AI API.

Minimal terdapat dua metode pengumpulan:

1. RSS/Atom parser.
2. HTML scraper berbasis selector.

Prioritaskan RSS terlebih dahulu karena formatnya lebih stabil dan lebih ringan.

## 5.2 P1 — Supporting Features

Setelah Core MVP

| Feature                  | Description                 |
| ------------------------ | --------------------------- |
| AI Classification        | Klasifikasi fenomena berita |
| AI Summary               | Ringkasan berita            |
| Location Extraction      | Identifikasi lokasi         |
| Trend Monitoring         | Grafik perkembangan isu     |
| Category Management      | Pengelolaan kategori        |
| Excel Export             | Ekspor XLSX                 |
| PDF Report               | Laporan PDF                 |
| Source Health Monitoring | Monitoring kesehatan sumber |

## 5.3 P2 — Future Development

- Multi-region monitoring.
- Multi-user authentication.
- Role-based access control.
- Custom keyword monitoring.
- Notification melalui email atau Telegram.
- AI-powered research assistant.
- Advanced geographical visualization.
- Official statistics integration.
- Historical event clustering.
- SocioWatch platform expansion.

## 5.4 MVP Feature Boundary

MVP harus memenuhi kondisi berikut:

- Berita bisa dikumpulkan.
- Berita bisa disimpan.
- Berita bisa ditampilkan.
- Berita bisa dicari.
- Berita bisa difilter.
- Berita tidak terduplikasi.
- Scraping bisa dijadwalkan.
- Scraping bisa dijalankan manual.
- Riwayat scraping dapat diperiksa.

AI classification dan AI summary tidak boleh menghambat penyelesaian fitur scraper utama.

# 6. Functional Requirements

## FR-01 — News Source Management

Description: Sistem menyediakan pengelolaan sumber berita.

Perilaku:

- Menambahkan sumber berita.
- Mengedit nama sumber.
- Mengaktifkan dan menonaktifkan sumber.
- Menentukan jenis sumber.
- Menentukan URL RSS atau website.
- Menentukan konfigurasi scraping.

Acceptance criteria:

- Pengguna dapat menambahkan sumber baru.
- URL wajib divalidasi.
- Sumber nonaktif tidak diproses scraper.
- Sumber dapat diedit dan dihapus sesuai aturan relasi data.
- Setiap sumber memiliki status aktif/nonaktif.

## FR-02 — RSS News Scraping

Description: Sistem mengambil berita melalui RSS/Atom feed.

Perilaku:

- Mengambil feed.
- Memproses item berita.
- Mengambil title, URL, publication date, dan description.
- Menyimpan metadata.
- Melakukan deduplication.

Acceptance criteria:

- RSS valid dapat diproses.
- Item berita dapat disimpan.
- Item duplikat tidak membuat record baru.
- Error RSS dicatat.
- Scraper dapat melanjutkan pemrosesan sumber lain ketika satu sumber gagal.

## FR-03 — HTML News Scraping

Description: Sistem mengambil metadata berita dari website yang menyediakan akses publik.

Perilaku:

- HTTP request.
- HTML parsing.
- CSS selector extraction.
- Normalisasi data.
- Error handling.

Acceptance criteria:

- HTML parser dapat menggunakan konfigurasi selector.
- Artikel tidak valid dilewati.
- Timeout ditangani.
- Sistem menghormati robots.txt dan ketentuan sumber.
- Tidak ada bypass proteksi website.

## FR-04 — Scheduled Scraping

Description: Sistem menjalankan scraping secara berkala.

Konfigurasi awal:

- Harian.
- Mingguan.
- Bulanan.

Acceptance criteria:

- Scheduler berjalan pada background worker.
- Waktu eksekusi dapat dikonfigurasi.
- Status scraping tersimpan.
- Tidak ada dua job global yang berjalan bersamaan tanpa kontrol.
- Kegagalan job dapat dilihat dari dashboard.

## FR-05 — Manual Scraping

Description: Pengguna dapat memulai scraping secara manual.

Acceptance criteria:

- Terdapat tombol Run Scraper.
- Sistem memberikan konfirmasi sebelum memulai.
- Proses berjalan di background.
- UI menampilkan status job.
- Sistem mencegah trigger berulang yang tidak diperlukan.

## FR-06 — News Storage

Description: Sistem menyimpan berita ke PostgreSQL.

Data minimal:

- Title.
- URL.
- Source.
- Published date.
- Description.
- Extracted content jika diizinkan.
- Category.
- Location.
- Created timestamp.

Acceptance criteria:

- Record tersimpan dengan validasi.
- URL memiliki unique constraint atau mekanisme deduplication yang setara.
- Timestamp disimpan konsisten dalam UTC.
- Data sumber tetap dapat ditelusuri.

## FR-07 — Keyword Filtering

Description: Sistem mendeteksi berita relevan berdasarkan kata kunci.

Contoh keyword:

| Category            | Keywords                                       |
| ------------------- | ---------------------------------------------- |
| Kemiskinan          | kemiskinan, miskin ekstrem, warga miskin       |
| Perumahan           | rumah tidak layak huni, RTLH, permukiman kumuh |
| Pendidikan          | putus sekolah, anak tidak sekolah              |
| Kesehatan           | stunting, gizi buruk                           |
| Ketenagakerjaan     | PHK, pengangguran                              |
| Pangan              | rawan pangan, kelangkaan pangan                |
| Perlindungan Sosial | bansos, bantuan sosial                         |
| Bencana             | banjir, kebakaran, pengungsian                 |

Acceptance criteria:

- Keyword dapat dikonfigurasi.
- Berita yang tidak relevan dapat difilter.
- Matching tidak bergantung pada huruf kapital.
- Kategori dapat memiliki banyak keyword.
- Hasil matching dapat ditelusuri.

## FR-08 — News Explorer

Description: Menampilkan berita yang telah dikumpulkan.

Acceptance criteria:

- Berita ditampilkan dalam daftar atau tabel.
- Pengguna dapat membuka artikel asli.
- Metadata berita ditampilkan.
- Pagination berfungsi.
- Empty state tersedia.

## FR-09 — Search & Filter

Filter:

- Search query.
- Category.
- Source.
- Date range.
- Location jika tersedia.

Acceptance criteria:

- Filter dapat dikombinasikan.
- Pagination mempertahankan filter.
- Search tidak menyebabkan full table scan yang tidak perlu ketika dataset berkembang.
- Filter menghasilkan data yang konsisten.

## FR-10 — Dashboard

Dashboard menampilkan:

- Total berita terkumpul.
- Total sumber aktif.
- Jumlah scraping berhasil.
- Jumlah scraping gagal.
- Berita terbaru.
- Distribusi kategori.
- Grafik berita berdasarkan periode.

Acceptance criteria:

- Data berasal dari database.
- Statistik mengikuti filter periode.
- Dashboard tidak menampilkan data dummy di production.
- Disclaimer disediakan.

## FR-11 — Scraping Logs

Acceptance criteria:

- Menampilkan riwayat scraping.
- Menampilkan waktu mulai dan selesai.
- Menampilkan jumlah berita ditemukan.
- Menampilkan jumlah berita baru.
- Menampilkan jumlah berita duplikat.
- Menampilkan error jika terjadi.

## FR-12 — CSV Export

Acceptance criteria:

- Data dapat diekspor menjadi CSV.
- Filter yang aktif diterapkan.
- Encoding UTF-8 digunakan.
- CSV aman dari formula injection.
- Nama kolom jelas.

## FR-13 — AI Classification (P1)

Sistem dapat mengklasifikasikan berita ke dalam kategori fenomena.

Output:

- Category.
- Confidence score.
- Reason singkat.
- Model identifier.

Acceptance criteria:

- Hasil AI divalidasi menggunakan schema.
- Kegagalan AI tidak menggagalkan penyimpanan berita.
- Hasil AI ditandai sebagai hasil otomatis.
- Confidence score bukan probabilitas statistik yang terkalibrasi.
- Pengguna dapat mengetahui bahwa klasifikasi belum tentu benar.

## FR-14 — AI Summary (P1)

Acceptance criteria:

- Ringkasan dibuat dari teks berita yang tersedia dan diizinkan.
- Ringkasan tidak mengubah fakta utama.
- Jika teks tidak tersedia, ringkasan tidak dibuat.
- Kegagalan AI dicatat.
- Sumber asli tetap tersedia.

## FR-15 — Location Extraction (P1)

Acceptance criteria:

- Lokasi diambil dari konten berita.
- Sistem dapat menyimpan nama wilayah dan level administratif.
- Lokasi yang tidak pasti tidak boleh dipaksakan.
- Hasil ekstraksi ditandai sebagai otomatis.
- Tidak menganggap lokasi portal berita sebagai lokasi kejadian.

# 7. Non-Functional Requirements

| Aspect          | Requirement                                                       |
| --------------- | ----------------------------------------------------------------- |
| Performance     | Halaman utama idealnya tampil dalam 2–3 detik pada kondisi normal |
| API             | Pagination dan filtering diterapkan                               |
| Reliability     | Kegagalan satu sumber tidak menghentikan seluruh job              |
| Security        | Input divalidasi menggunakan schema                               |
| Scalability     | Worker dapat dipisahkan dan ditambah secara independen            |
| Maintainability | Modular architecture                                              |
| Accessibility   | Keyboard navigation dan semantic HTML                             |
| Compatibility   | Chrome, Firefox, Edge, Safari modern                              |
| Privacy         | Tidak mengumpulkan data pribadi yang tidak diperlukan             |
| SEO             | Metadata dan public page indexing                                 |
| Logging         | Logging terstruktur                                               |
| Data Integrity  | Unique constraint dan validasi data                               |

## 7.1 Scraper Performance

- Setiap request memiliki timeout.
- Request dilakukan secara terbatas.
- Terapkan concurrency limit.
- Gunakan User-Agent yang jelas.
- Gunakan exponential backoff jika diperlukan.
- Hindari request berlebihan.
- Cache metadata yang sesuai.

## 7.2 Initial Limits

| Parameter                        | Initial Value            |
| -------------------------------- | ------------------------ |
| Request timeout                  | 15 detik                 |
| Per-source concurrency           | 1                        |
| Global concurrency               | 3                        |
| Retry                            | Maksimal 2               |
| Scraping frequency               | Harian atau lebih jarang |
| Default article limit/source/run | 50                       |
| API pagination                   | 20–50 records            |

Nilai ini merupakan konfigurasi awal yang dapat diubah setelah pengujian.

# 8. Application Structure & Navigation

## 8.1 Main Routes

| Route            | Page             | Description        |
| ---------------- | ---------------- | ------------------ |
| `/`              | Dashboard        | Overview           |
| `/news`          | News Explorer    | Daftar berita      |
| `/news/[id]`     | News Detail      | Detail berita      |
| `/sources`       | News Sources     | Pengelolaan sumber |
| `/scraping`      | Scraping Monitor | Monitoring job     |
| `/scraping/logs` | Scraping Logs    | Riwayat eksekusi   |
| `/categories`    | Categories       | Kategori fenomena  |
| `/settings`      | Settings         | Konfigurasi        |

Kategori dan settings dapat diposisikan sebagai halaman internal MVP.

## 8.2 Navigation Structure

## PovertyWatch Navigation

&#x20;Dashboard

&#x20;News Explorer

&#x20;News Sources

&#x20;Scraping Monitor

&#x20;Scraping Logs

&#x20;Categories

&#x20;Settings

## 8.3 Reusable Components

- AppSidebar.
- AppHeader.
- PageHeader.
- StatCard.
- NewsCard.
- NewsTable.
- NewsFilters.
- CategoryBadge.
- SourceBadge.
- ScrapingStatusBadge.
- ScrapingJobTable.
- DateRangePicker.
- EmptyState.
- ErrorState.
- LoadingSkeleton.
- ConfirmDialog.
- ExportButton.

# 9. User Flow

## 9.1 Main User Flow

1. Pengguna membuka PovertyWatch.
2. Dashboard menampilkan statistik pengumpulan berita.
3. Pengguna membuka News Explorer.
4. Sistem menampilkan berita yang telah dikumpulkan.
5. Pengguna melakukan pencarian.
6. Pengguna memilih kategori dan periode.
7. Sistem menampilkan hasil filter.
8. Pengguna membuka detail berita.
9. Pengguna dapat mengakses artikel asli.
10. Pengguna dapat mengekspor data.

## 9.2 Admin/Operator Flow

Untuk MVP, pengelolaan sistem menggunakan akses operator sederhana.

1. Operator membuka halaman Sources.
2. Operator menambahkan RSS atau URL sumber.
3. Operator mengatur konfigurasi sumber.
4. Operator membuka Scraping Monitor.
5. Operator menjalankan scraping manual.
6. Worker memproses sumber.
7. Sistem menyimpan berita.
8. Operator melihat hasil scraping.

Catatan: MVP dapat menggunakan akses operator melalui proteksi sederhana. Jangan membiarkan endpoint pengelolaan sumber dan trigger scraping terbuka tanpa autentikasi pada deployment publik.

# 10. UI/UX Requirements

## 10.1 Design Direction

PovertyWatch menggunakan gaya visual:

- Professional.
- Data-centric.
- Minimalist.
- Modern analytics dashboard.
- Editorial information platform.

Referensi visual yang dapat dijadikan inspirasi:

- Dashboard analytics.
- News monitoring platform.
- Research information portal.

## 10.2 Color Palette

| Token      | Color            | Purpose         |
| ---------- | ---------------- | --------------- |
| Primary    | Navy / Dark Blue | Primary action  |
| Secondary  | Slate            | Secondary text  |
| Accent     | Teal             | Highlight       |
| Background | Off-white        | Main background |
| Surface    | White            | Cards           |
| Danger     | Red              | Error           |
| Warning    | Amber            | Warning         |
| Success    | Green            | Success         |

## 10.3 Typography

Gunakan:

- Inter atau Geist Sans.
- Font weight 400 untuk body.
- Font weight 500–600 untuk heading.
- Heading hierarchy yang konsisten.

## 10.4 Dashboard Layout

[Mira - React Material UI Admin Dashboard](https://images.openai.com/static-rsc-4/J-2iqir2nsz7sLLQgoUHqNdq6ge3kTcpbKEYh6GPFqXSeL7-feHYmXkcGgaK2CIutQhAighZd-MMep8L7aOYdsDO4axXHD3vbvF84hjHex9aQyjWI2Ewci6G8bFTjsLn80DCyDmjHrmb0Tc2yX5DbbcyX96zyv1HF8RCduCkMA4?purpose=inline)

[mira.bootlab.io](https://mira.bootlab.io/?utm_source=chatgpt.com)

Dashboard harus menyediakan:

1. Summary cards.
2. News trend chart.
3. Category distribution.
4. Latest news.
5. Scraper status.
6. Data coverage information.

## 10.5 News Explorer

[AI News Automation Platform | News Studio](https://images.openai.com/static-rsc-4/Nax6FpwN2aasz82R7svw_53af1E4l-gtf_6UzcrjcMd1XvefgNWQXHtdLenxnsvX8FTG88ippVweWAE_pVC05fXfulKXZ-lrPBQdgnH8Ya4z5RrKKtLlsQq8GYW_yPNTKzqPbcHZCMG5mvnvqhrM_o9yhLH0STbKKRISFPUmC3w?purpose=inline)

[newsstudio.io](https://newsstudio.io/platform/?utm_source=chatgpt.com)

News Explorer harus memiliki:

- Search input.
- Category filter.
- Source filter.
- Date filter.
- Sort by newest.
- News list/table.
- Pagination.

## 10.6 Responsive Behavior

| Screen       | Behavior            |
| ------------ | ------------------- |
| Desktop      | Full sidebar        |
| Tablet       | Collapsible sidebar |
| Mobile       | Drawer navigation   |
| Mobile News  | Card layout         |
| Desktop News | Table/list layout   |

## 10.7 UI States

Setiap halaman wajib mempunyai:

- Loading state.
- Empty state.
- Error state.
- Success feedback.
- Disabled state.
- Confirmation state untuk tindakan penting.

# 11. Error Handling

| Error                    | Cause                    | System Response         |
| ------------------------ | ------------------------ | ----------------------- |
| RSS unavailable          | Source down              | Log failure             |
| Invalid RSS              | Malformed XML            | Skip source             |
| HTML selector mismatch   | Website berubah          | Mark extraction warning |
| Request timeout          | Slow website             | Retry limited           |
| Duplicate article        | URL already exists       | Skip insert             |
| Database unavailable     | DB connection issue      | Fail job safely         |
| AI API unavailable       | External API issue       | Continue without AI     |
| Invalid URL              | User input error         | Validation message      |
| Unauthorized             | Invalid session          | Reject request          |
| Scraping already running | Concurrent trigger       | Return conflict         |
| Export failure           | Query or streaming error | Show error              |
| Empty results            | No matching records      | Show empty state        |

Error response API menggunakan format konsisten:

```
{
  "success": false,
  "error": {
    "code": "SOURCE_FETCH_FAILED",
    "message": "Unable to fetch the configured source."
  }
}
```

# 12. Technical Architecture

## 12.1 Architecture Decision

Recommended for MVP

Gunakan Modular Monolith + Dedicated Background Worker.

Alasan:

1. Next.js cocok untuk web interface dan REST API sederhana.
2. Scraping membutuhkan proses yang tidak cocok dijalankan dalam request serverless biasa.
3. Worker dapat berjalan secara independen.
4. PostgreSQL menjadi sumber data utama.
5. Tidak membutuhkan infrastruktur message broker pada MVP.
6. Seluruh kode dapat dikelola dalam satu repository.

## 12.2 System Architecture

## System Architecture

User / Browser

Next.js Frontend

Next.js Application

Pages · Components · Route Handlers · Services

PostgreSQL

Sources · News · Categories · Jobs · Logs

Node.js Background Worker

Scheduler · Scraper · Parser · Normalizer · Deduplicator

External News Sources

RSS · Atom · Public HTML

Optional AI Provider

Classification · Summary · Location Extraction

## 12.3 Layer Responsibilities

### Presentation Layer

Berisi:

- Next.js pages.
- Layouts.
- React components.
- Client-side state.
- Form interfaces.

Tidak boleh mengandung scraping logic.

### Application Layer

Berisi:

- Use cases.
- Application services.
- Request orchestration.
- Data transformation.

Contoh:

```
RunScrapingJob
GetNewsList
GetDashboardStats
CreateNewsSource
ExportNews
```

### Business Logic Layer

Berisi:

- News normalization.
- URL normalization.
- Deduplication.
- Keyword matching.
- Relevance scoring.
- Category matching.

### Data Access Layer

Berisi:

- Prisma repositories.
- Database queries.
- Transaction management.

### Infrastructure Layer

Berisi:

- RSS parser.
- HTTP client.
- HTML parser.
- Scheduler.
- AI provider.
- Logging.
- External services.

## 12.4 Background Worker Strategy

Worker berjalan sebagai Node.js process terpisah.

Contoh:

```
npm run worker
```

Worker bertugas:

1. Memuat konfigurasi sumber aktif.
2. Memeriksa jadwal.
3. Membuat scraping job.
4. Memproses RSS.
5. Memproses HTML.
6. Menormalisasi berita.
7. Memeriksa duplikasi.
8. Menyimpan berita.
9. Mencatat hasil.
10. Memperbarui status job.

### Scheduler

Gunakan `node-cron` pada MVP.

Konfigurasi awal:

```
Daily:   0 6 * * *
Weekly:  0 6 * * 1
Monthly: 0 6 1 * *
```

Timezone:

```
Asia/Jakarta
```

Penting: Scheduler harus menggunakan mekanisme database lock atau job claim yang aman agar tidak menjalankan job ganda ketika worker restart atau terdapat beberapa instance.

Untuk MVP, satu instance worker sudah cukup.

## 12.5 Scraping Engine

Gunakan interface umum:

```
interface NewsScraper {
  scrape(source: NewsSource): Promise<ScrapeResult>;
}

interface ScrapeResult {
  items: ScrapedNews[];
  errors: ScrapeError[];
}

interface ScrapedNews {
  title: string;
  url: string;
  publishedAt?: Date;
  description?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
}
```

Implementasi:

```
RssScraper
HtmlScraper
```

Pemilihan scraper berdasarkan `source.type`.

Jangan membuat abstract framework scraper yang kompleks.

## 12.6 Scraping Pipeline

Urutan wajib:

```
Fetch Source
    ↓
Parse Feed / HTML
    ↓
Validate Required Fields
    ↓
Normalize URL
    ↓
Normalize Text
    ↓
Check Duplicate
    ↓
Keyword Relevance Filtering
    ↓
Category Matching
    ↓
Persist News
    ↓
Log Result
```

AI enrichment dilakukan setelah penyimpanan berita, melalui proses tambahan yang dapat gagal secara independen.

## 12.7 API Architecture

Gunakan Next.js Route Handlers.

Endpoint:

| Method | Endpoint                  | Purpose          |
| ------ | ------------------------- | ---------------- |
| GET    | `/api/news`               | List news        |
| GET    | `/api/news/[id]`          | News detail      |
| GET    | `/api/dashboard/stats`    | Dashboard stats  |
| GET    | `/api/sources`            | Source list      |
| POST   | `/api/sources`            | Create source    |
| PATCH  | `/api/sources/[id]`       | Update source    |
| DELETE | `/api/sources/[id]`       | Delete source    |
| POST   | `/api/scraping/run`       | Trigger scraping |
| GET    | `/api/scraping/jobs`      | List jobs        |
| GET    | `/api/scraping/jobs/[id]` | Job detail       |
| GET    | `/api/categories`         | Category list    |
| GET    | `/api/news/export`        | CSV export       |

Semua endpoint harus memvalidasi input.

## 12.8 Worker Communication

Pada MVP, Next.js dan worker berbagi PostgreSQL.

Alur:

1. API membuat record `ScrapingJob`.
2. Worker melakukan polling terhadap job yang pending.
3. Worker mengklaim job menggunakan transaksi database.
4. Worker menjalankan scraping.
5. Worker menyimpan hasil.
6. Worker mengubah status job menjadi completed atau failed.

Gunakan PostgreSQL row locking atau conditional update untuk menghindari job diambil oleh beberapa worker sekaligus.

Tidak perlu Redis/BullMQ pada tahap awal.

## 12.9 Recommended Folder Structure

```
povertywatch/
│
├── docs/
│   ├── PROJECT_PRD_AND_PLAYBOOK.md
│   ├── TECHNICAL_PLAN.md
│   ├── UI_UX_GUIDE.md
│   ├── TEST_REPORT.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── RELEASE_NOTES.md
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx
│   │   │   ├── news/
│   │   │   ├── sources/
│   │   │   ├── scraping/
│   │   │   ├── categories/
│   │   │   └── settings/
│   │   │
│   │   └── api/
│   │       ├── news/
│   │       ├── sources/
│   │       ├── scraping/
│   │       ├── categories/
│   │       └── dashboard/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── news/
│   │   └── scraping/
│   │
│   ├── features/
│   │   ├── news/
│   │   ├── sources/
│   │   ├── scraping/
│   │   └── dashboard/
│   │
│   ├── lib/
│   │   ├── db/
│   │   ├── auth/
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── server/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── scrapers/
│   │   ├── processors/
│   │   └── integrations/
│   │
│   ├── types/
│   └── stores/
│
├── worker/
│   ├── index.ts
│   ├── scheduler.ts
│   ├── job-runner.ts
│   └── services/
│
├── scripts/
│   ├── seed.ts
│   └── test-scraper.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
└── tsconfig.json
```

Struktur final ditetapkan dalam Phase 2. Jangan membuat seluruh folder kosong pada Phase 1.

# 13. Data Model

## 13.1 Database Decision

Gunakan PostgreSQL.

Alasan:

- Data berita memiliki relasi dengan sumber dan kategori.
- Memerlukan filter tanggal.
- Memerlukan agregasi statistik.
- Memerlukan unique constraint.
- Memerlukan transaksi untuk pengelolaan scraping jobs.
- Dapat dikembangkan untuk multi-region.

Gunakan Prisma ORM.

## 13.2 Entity Overview

NewsSource

1 source memiliki banyak news dan scraping jobs

News

Banyak news dapat terhubung ke kategori

Category

ScrapingJob

Menyimpan status dan hasil scraping

ScrapingLog

NewsKeyword

Konfigurasi keyword untuk kategori

## 13.3 Main Entities

### NewsSource

```
interface NewsSource {
  id: string;
  name: string;
  baseUrl: string;
  feedUrl?: string;
  type: "RSS" | "HTML";
  isActive: boolean;
  scrapeFrequency: "DAILY" | "WEEKLY" | "MONTHLY";
  lastScrapedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### News

```
interface News {
  id: string;
  sourceId: string;
  title: string;
  url: string;
  normalizedUrl: string;
  description?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: Date;
  categoryId?: string;
  locationName?: string;
  locationLevel?: string;
  aiSummary?: string;
  isRelevant: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}
```

### NewsKeyword

```
interface NewsKeyword {
  id: string;
  categoryId: string;
  keyword: string;
  isActive: boolean;
}
```

### ScrapingJob

```
interface ScrapingJob {
  id: string;
  sourceId?: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  triggerType: "MANUAL" | "SCHEDULED";
  startedAt?: Date;
  finishedAt?: Date;
  totalFound: number;
  totalNew: number;
  totalDuplicate: number;
  totalFailed: number;
}
```

### ScrapingLog

```
interface ScrapingLog {
  id: string;
  jobId: string;
  sourceId: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  createdAt: Date;
}
```

## 13.4 Relationships

| Relationship              | Type        |
| ------------------------- | ----------- |
| NewsSource → News         | One-to-Many |
| NewsSource → ScrapingJob  | One-to-Many |
| ScrapingJob → ScrapingLog | One-to-Many |
| Category → News           | One-to-Many |
| Category → NewsKeyword    | One-to-Many |

## 13.5 Important Database Constraints

- `News.normalizedUrl` unique.
- `Category.slug` unique.
- `NewsSource` URL configuration tervalidasi.
- Index pada `News.publishedAt`.
- Index pada `News.categoryId`.
- Index pada `News.sourceId`.
- Index pada `ScrapingJob.status`.

Gunakan PostgreSQL migration untuk semua perubahan schema.

## 13.6 Future Data Model

Pada pengembangan multi-region, tambahkan:

```
Region
- id
- name
- code
- level
- parentId
```

Relasi kategori dan lokasi dapat dikembangkan untuk mendukung kabupaten/kota, kecamatan, dan kelurahan.

Jangan mengimplementasikan seluruh struktur geografis kompleks pada MVP.

# 14. Security & Privacy

## 14.1 Input Validation

Gunakan Zod untuk:

- URL.
- Search query.
- Date range.
- Category ID.
- Source ID.
- API payload.

## 14.2 SSRF Protection

Ini merupakan risiko penting pada aplikasi scraping.

Karena pengguna dapat memasukkan URL sumber, sistem harus:

- Hanya mengizinkan HTTP/HTTPS.
- Memblokir localhost.
- Memblokir private IP ranges.
- Memblokir link-local addresses.
- Memeriksa DNS resolution.
- Memvalidasi redirect destination.
- Membatasi ukuran response.
- Membatasi timeout.
- Tidak mengakses metadata endpoint cloud.
- Menghindari akses ke jaringan internal.

Validasi harus dilakukan pada worker juga, bukan hanya frontend.

## 14.3 API Security

- Admin endpoint harus dilindungi autentikasi.
- Terapkan rate limiting pada trigger scraping.
- Validasi request origin dan CSRF sesuai mekanisme autentikasi.
- Jangan mengekspos database credentials.
- Gunakan error response yang tidak membocorkan informasi internal.

## 14.4 Authentication

Untuk MVP:

- Halaman monitoring berita dapat bersifat publik.
- Halaman Sources, Settings, dan trigger scraping harus memerlukan autentikasi operator.
- Gunakan proteksi admin sederhana yang aman.
- Jangan membuat sistem multi-role kompleks.

Gunakan solusi session-based authentication yang sesuai dengan Next.js dan telah diverifikasi kompatibilitasnya saat Phase 2.

## 14.5 Environment Variables

```
DATABASE_URL=
ADMIN_SESSION_SECRET=
AI_API_KEY=
AI_PROVIDER=
SCRAPER_USER_AGENT=
NEXT_PUBLIC_APP_URL=
```

`AI_API_KEY` boleh kosong selama fitur AI belum digunakan.

Jangan pernah menggunakan prefix `NEXT_PUBLIC_` untuk secret.

## 14.6 Data Retention

- Simpan metadata berita selama masih diperlukan.
- Hindari menyimpan full text artikel tanpa izin.
- Simpan log scraping dengan kebijakan retensi.
- Berikan mekanisme penghapusan sumber dan data sesuai kebijakan.
- Hindari menyimpan informasi pribadi sensitif.

## 14.7 Source Compliance

Setiap sumber berita harus:

- Memiliki identitas sumber.
- Memiliki URL asal.
- Memiliki konfigurasi scraping.
- Menghormati robots.txt dan ketentuan penggunaan.
- Tidak diakses secara agresif.
- Tidak menggunakan bypass proteksi.

PovertyWatch harus mengutamakan metadata, judul, cuplikan, dan tautan artikel asli.

# 15. Success Criteria

MVP dianggap selesai apabila:

| ID    | Criteria                         | Status Target |
| ----- | -------------------------------- | ------------- |
| SC-01 | Website dapat diakses            | Pass          |
| SC-02 | PostgreSQL terhubung             | Pass          |
| SC-03 | Source dapat ditambahkan         | Pass          |
| SC-04 | RSS scraper berjalan             | Pass          |
| SC-05 | HTML scraper dasar berjalan      | Pass          |
| SC-06 | Scheduled scraping berjalan      | Pass          |
| SC-07 | Manual scraping berjalan         | Pass          |
| SC-08 | Duplicate detection berfungsi    | Pass          |
| SC-09 | News Explorer berjalan           | Pass          |
| SC-10 | Search dan filter berjalan       | Pass          |
| SC-11 | Dashboard menampilkan data nyata | Pass          |
| SC-12 | Scraping logs tersedia           | Pass          |
| SC-13 | CSV export berjalan              | Pass          |
| SC-14 | Endpoint admin terlindungi       | Pass          |
| SC-15 | Production deployment berhasil   | Pass          |

## 15.1 MVP Benchmark

Target awal:

- Minimal 5 sumber berita aktif yang tervalidasi.
- Minimal satu siklus scraping terjadwal berhasil.
- Minimal satu sumber RSS dan satu sumber HTML berhasil diuji.
- Tidak ada duplikasi URL yang tersimpan.
- Semua error scraper tercatat.
- Semua halaman inti responsif.
- Tidak ada data dummy pada production.

# 16. Risks & Technical Constraints

| Risk                  | Impact                      | Mitigation                |
| --------------------- | --------------------------- | ------------------------- |
| Website mengubah HTML | Scraper gagal               | Source-specific selectors |
| RSS tidak tersedia    | Sumber tidak dapat diproses | HTML fallback             |
| Artikel duplikat      | Statistik tidak akurat      | URL normalization         |
| AI hallucination      | Salah klasifikasi           | Confidence + review       |
| Database overload     | Aplikasi lambat             | Indexing + pagination     |
| Worker crash          | Job terhenti                | Job recovery              |
| Website blocking      | Scraping gagal              | Respectful rate limiting  |
| Invalid location      | Salah interpretasi          | Store uncertainty         |
| AI API cost           | Biaya meningkat             | Optional enrichment       |
| SSRF                  | Infrastruktur terancam      | URL/IP validation         |
| Copyright             | Risiko legal                | Metadata-first collection |

## 16.1 Technical Constraints

- RSS menjadi prioritas.
- HTML scraper bersifat configurable.
- Jangan membuat scraper universal yang menjanjikan kompatibilitas semua website.
- Scraping dijalankan melalui worker.
- AI enrichment tidak boleh menghambat ingestion.
- PostgreSQL merupakan sumber data utama.
- Semua data harus memiliki provenance atau asal sumber.

# PART B — SEQUENTIAL DEVELOPMENT PLAYBOOK

# PHASE 1 — Environment & Project Bootstrap

Foundation

## 1. Phase Objective

Mempersiapkan development environment dan membuat project Next.js yang siap dikembangkan.

Tidak ada implementasi fitur scraping pada tahap ini.

## 2. Scope of Work

- Install Node.js.
- Setup package manager.
- Setup Next.js.
- Setup TypeScript.
- Setup Tailwind CSS.
- Setup shadcn/ui.
- Setup Git.
- Setup ESLint.
- Setup environment file.
- Verifikasi project.

## 3. Technology Decisions

| Component       | Choice             |
| --------------- | ------------------ |
| Runtime         | Node.js LTS        |
| Package Manager | npm                |
| Framework       | Next.js App Router |
| Language        | TypeScript         |
| CSS             | Tailwind CSS       |
| Components      | shadcn/ui          |
| Version Control | Git                |

Gunakan Node.js LTS yang masih didukung dan kompatibel dengan versi Next.js yang dipilih.

## 4. Detailed Implementation Steps

### Step 1 — Check Environment

```
node --version
npm --version
git --version
```

### Step 2 — Create Project

```
npx create-next-app@latest povertywatch
```

Pilih:

- TypeScript: Yes.
- ESLint: Yes.
- Tailwind CSS: Yes.
- src directory: Yes.
- App Router: Yes.
- Import alias: `@/*`.

### Step 3 — Enter Project

```
cd povertywatch
```

### Step 4 — Initialize Git

```
git init
git add .
git commit -m "chore: initial nextjs project"
```

Jika repository telah memiliki Git, jangan menjalankan `git init` ulang tanpa memeriksa kondisinya.

### Step 5 — Install Basic Dependencies

```
npm install zod lucide-react
```

Development dependency:

```
npm install -D prettier prettier-plugin-tailwindcss
```

### Step 6 — Setup shadcn/ui

```
npx shadcn@latest init
```

Tambahkan komponen dasar:

```
npx shadcn@latest add button card input
npx shadcn@latest add badge table dialog
npx shadcn@latest add dropdown-menu
```

### Step 7 — Environment File

Buat:

```
.env.example
```

Isi:

```
DATABASE_URL=
ADMIN_SESSION_SECRET=
AI_API_KEY=
AI_PROVIDER=
SCRAPER_USER_AGENT=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8 — Verify

```
npm run dev
```

Buka:

```
http://localhost:3000
```

### Step 9 — Validate

```
npx tsc --noEmit
npm run lint
npm run build
```

## 5. Expected Deliverables

- Next.js project.
- TypeScript configuration.
- Tailwind configuration.
- shadcn/ui.
- ESLint.
- Git repository.
- `.env.example`.
- Basic project structure.

## 6. AI Coding Assistant Prompt

# PHASE 1 — Environment & Project Bootstrap

Kamu bertindak sebagai Senior Fullstack Developer.

Project: PovertyWatch

Dokumen utama:

- PROJECT_PRD_AND_PLAYBOOK.md

Tech stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- npm

Development approach:\
Solo developer, MVP first, pragmatic clean architecture.

## Objective

Siapkan environment dan bootstrap project PovertyWatch.

## Instructions

1. Baca seluruh bagian PRD yang relevan.
2. Periksa kondisi repository terlebih dahulu.
3. Periksa versi Node.js, npm, dan Git.
4. Jika project belum tersedia, buat Next.js project dengan App Router.
5. Aktifkan TypeScript, ESLint, dan Tailwind CSS.
6. Gunakan src directory.
7. Setup shadcn/ui.
8. Install dependency dasar yang benar-benar diperlukan.
9. Buat .env.example.
10. Pastikan konfigurasi Git dan .gitignore benar.
11. Pastikan project dapat dijalankan secara lokal.

## Expected Files

- package.json
- tsconfig.json
- next.config.ts
- src/app/
- src/components/
- src/lib/
- .env.example
- .gitignore

## Restrictions

- Jangan membuat scraper.
- Jangan membuat database schema.
- Jangan membuat API business logic.
- Jangan mengimplementasikan dashboard lengkap.
- Jangan menambahkan AI dependency.
- Jangan membuat Docker configuration dahulu.
- Jangan melanjutkan ke Phase 2.

## Verification

Jalankan:

- npm run dev
- npx tsc --noEmit
- npm run lint
- npm run build

Laporkan hasil aktual.

## Completion Report

Berikan:

1. Environment summary.
2. Project structure.
3. Dependency installed.
4. Files created/modified.
5. Testing results.
6. Known issues.
7. Git checkpoint recommendation.

Jangan commit jika verification gagal.

Berhenti setelah Phase 1 selesai.

## 7. Acceptance Criteria

- Node.js berjalan.
- Next.js project berhasil dibuat.
- TypeScript berjalan.
- Tailwind CSS berfungsi.
- shadcn/ui berhasil diinisialisasi.
- Git tersedia.
- Environment file tersedia.
- Development server berjalan.
- Typecheck berhasil.
- Lint berhasil.
- Production build berhasil.

## 8. Testing Requirements

```
npx tsc --noEmit
npm run lint
npm run build
```

## 9. Git Checkpoint

```
git add .
git commit -m "phase 1: project bootstrap"
```

# PHASE 2 — Technical Planning & Architecture

Architecture

## 1. Phase Objective

Menentukan arsitektur final PovertyWatch sebelum implementasi fitur.

Output utama:

`TECHNICAL_PLAN.md`

## 2. Scope of Work

- Menetapkan system architecture.
- Menentukan folder structure.
- Menentukan database.
- Menentukan scraper architecture.
- Menentukan worker architecture.
- Menentukan API contract.
- Menentukan external services.
- Menentukan dependency.
- Menentukan security boundaries.
- Menentukan deployment architecture.

## 3. Technical Decisions

Keputusan awal:

| Component  | Decision               |
| ---------- | ---------------------- |
| Frontend   | Next.js                |
| Backend    | Next.js Route Handlers |
| Database   | PostgreSQL             |
| ORM        | Prisma                 |
| Worker     | Node.js                |
| Scheduler  | node-cron              |
| RSS        | RSS parser             |
| HTML       | Cheerio                |
| Validation | Zod                    |
| Logging    | Pino                   |
| HTTP       | Native fetch           |
| Queue      | PostgreSQL polling     |

## 4. Detailed Implementation Steps

1. Review PRD.
2. Evaluasi dependency compatibility.
3. Tentukan versi package.
4. Buat architecture diagram.
5. Tentukan data flow.
6. Tentukan API contracts.
7. Tentukan database schema draft.
8. Tentukan worker communication.
9. Tentukan error strategy.
10. Tentukan security architecture.
11. Tentukan deployment topology.
12. Dokumentasikan seluruh keputusan.

### Dependency Evaluation

Sebelum menetapkan package, periksa:

```
npm view prisma version
npm view @prisma/client version
npm view rss-parser version
npm view cheerio version
npm view node-cron version
npm view pino version
```

Gunakan versi yang kompatibel satu sama lain.

### Database Architecture

Gunakan satu PostgreSQL instance.

### Worker Architecture

Worker menggunakan shared database.

### API Contract

Dokumentasikan request dan response setiap endpoint.

## 5. Expected Deliverables

```
docs/
└── TECHNICAL_PLAN.md
```

Dokumen wajib berisi:

- Architecture overview.
- Architecture diagram.
- Folder structure.
- Dependency list.
- Database model.
- API design.
- Scraper design.
- Worker design.
- Security plan.
- Deployment plan.
- Technical risks.

## 6. AI Coding Assistant Prompt

# PHASE 2 — Technical Planning & Architecture

Kamu bertindak sebagai Senior Software Architect.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md

## Objective

Buat technical architecture lengkap untuk PovertyWatch.

Hasil utama:\
docs/TECHNICAL_PLAN.md

## Tasks

1. Baca PRD secara menyeluruh.
2. Analisis kebutuhan News Scraper.
3. Tentukan arsitektur Modular Monolith.
4. Pisahkan Next.js application dan Node.js worker.
5. Tentukan PostgreSQL sebagai database.
6. Tentukan Prisma sebagai ORM.
7. Tentukan RSS dan HTML scraper architecture.
8. Tentukan scheduler menggunakan node-cron.
9. Tentukan mekanisme job polling dan locking melalui PostgreSQL.
10. Tentukan deduplication strategy.
11. Tentukan API contracts.
12. Tentukan database relationships.
13. Tentukan logging dan error handling.
14. Tentukan SSRF protection.
15. Tentukan autentikasi untuk operator.
16. Tentukan deployment architecture.

## Dependency Review

Evaluasi compatibility dan maintenance status dependency.

Jangan memilih package hanya berdasarkan popularitas.

## Expected Output

Buat docs/TECHNICAL_PLAN.md dengan:

- Architecture overview.
- System diagram.
- Layer responsibilities.
- Folder structure.
- Database schema draft.
- API endpoints.
- Worker lifecycle.
- Scraping lifecycle.
- Dependency decisions.
- Security architecture.
- Deployment architecture.
- Technical risks.

## Restrictions

- Jangan implementasikan fitur.
- Jangan membuat scraper.
- Jangan membuat UI.
- Jangan melakukan database migration.
- Jangan menambahkan Redis atau message broker tanpa alasan kuat.
- Jangan menggunakan microservices.
- Jangan melanjutkan Phase 3.

## Completion Report

Laporkan:

1. Architecture decisions.
2. Database decisions.
3. Worker design.
4. Dependency decisions.
5. Security considerations.
6. Files created.
7. Open technical questions.

Berhenti setelah technical plan selesai.

## 7. Acceptance Criteria

- `TECHNICAL_PLAN.md` tersedia.
- Architecture sesuai PRD.
- Worker terpisah dari Next.js.
- PostgreSQL dipilih dengan alasan.
- Scraping pipeline terdokumentasi.
- API contract tersedia.
- Database relationships tersedia.
- Security strategy tersedia.
- Deployment topology tersedia.
- Tidak terdapat dependency yang tidak diperlukan.

## 8. Testing Requirements

Dokumen diverifikasi terhadap:

- PRD.
- Kebutuhan MVP.
- Dependency compatibility.
- Runtime compatibility.
- Security requirements.

## 9. Git Checkpoint

```
git add .
git commit -m "phase 2: technical architecture"
```

# PHASE 3 — UI/UX Planning & Design System

Design

## 1. Phase Objective

Menentukan pengalaman pengguna dan design system PovertyWatch.

Output:

`docs/UI_UX_GUIDE.md`

## 2. Scope of Work

- Design direction.
- Color palette.
- Typography.
- Spacing.
- Navigation.
- Dashboard layout.
- News Explorer layout.
- Sources page.
- Scraping Monitor.
- Empty states.
- Error states.
- Responsive design.

## 3. Design Principles

1. Data readability first.
2. Minimal visual noise.
3. Professional dashboard.
4. Clear information hierarchy.
5. Consistent component behavior.
6. Responsive interface.
7. Accessible interaction.

## 4. Detailed Implementation Steps

### Step 1 — Define Design Tokens

```
Primary
Secondary
Accent
Background
Surface
Border
Muted
Success
Warning
Danger
```

### Step 2 — Define Typography

Geist Sans atau Inter.

### Step 3 — Define Navigation

Sidebar:

- Dashboard.
- News Explorer.
- Sources.
- Scraping Monitor.
- Scraping Logs.
- Categories.
- Settings.

### Step 4 — Define Dashboard

Stat cards:

- Total News.
- Active Sources.
- Successful Jobs.
- Failed Jobs.

Charts:

- News over time.
- Category distribution.

### Step 5 — Define News Explorer

- Search.
- Date filter.
- Category filter.
- Source filter.
- News table.
- Pagination.

### Step 6 — Define Scraping Monitor

- Start scraping.
- Current job status.
- Source health.
- Last execution.
- Logs.

### Step 7 — Define Responsive Layout

Desktop, tablet, dan mobile.

## 5. Expected Deliverables

`docs/UI_UX_GUIDE.md`

Berisi:

- Design tokens.
- Typography.
- Component specification.
- Page layouts.
- Navigation.
- Responsive rules.
- Interaction states.

## 6. AI Coding Assistant Prompt

# PHASE 3 — UI/UX Planning & Design System

Kamu bertindak sebagai Senior UI/UX Designer dan Frontend Architect.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md

## Objective

Buat panduan UI/UX PovertyWatch.

Output:\
docs/UI_UX_GUIDE.md

## Tasks

1. Tentukan visual identity.
2. Tentukan color palette.
3. Tentukan typography.
4. Tentukan spacing system.
5. Tentukan border radius dan shadows.
6. Tentukan sidebar dan header.
7. Rancang dashboard.
8. Rancang News Explorer.
9. Rancang News Detail.
10. Rancang Sources Management.
11. Rancang Scraping Monitor.
12. Rancang Scraping Logs.
13. Tentukan reusable components.
14. Tentukan loading, empty, error, dan success states.
15. Tentukan responsive behavior.
16. Tentukan accessibility requirements.

## Design Direction

Professional, modern, clean, data-centric analytics dashboard.

Hindari:

- Terlalu banyak warna.
- Gradient berlebihan.
- Card berlebihan.
- Informasi statistik yang tidak relevan.
- Dashboard yang penuh dekorasi.

## Expected Output

Buat UI_UX_GUIDE.md yang bisa langsung digunakan developer.

## Restrictions

- Jangan mengimplementasikan UI.
- Jangan menambahkan dependency.
- Jangan membuat business logic.
- Jangan mengubah technical plan.
- Jangan melanjutkan Phase 4.

## Completion Report

Laporkan design decisions, page specification, reusable components, dan responsive behavior.

Berhenti setelah dokumentasi selesai.

## 7. Acceptance Criteria

- UI guide tersedia.
- Design tokens jelas.
- Navigation jelas.
- Dashboard dirancang.
- News Explorer dirancang.
- Sources Management dirancang.
- Scraping Monitor dirancang.
- Responsive behavior terdokumentasi.
- Component specification tersedia.

## 8. Testing Requirements

Review konsistensi antara PRD, technical plan, dan UI guide.

## 9. Git Checkpoint

```
git add .
git commit -m "phase 3: ui ux planning"
```

# PHASE 4 — Frontend Foundation & Application Shell

Frontend Foundation

## 1. Phase Objective

Mengimplementasikan struktur frontend dan application shell.

## 2. Scope of Work

- Final folder structure.
- Global layout.
- Sidebar.
- Header.
- Navigation.
- Theme configuration jika diperlukan.
- Reusable components.
- Basic routes.
- Responsive shell.

## 3. Detailed Implementation Steps

### Step 1 — Create Folder Structure

Ikuti technical plan.

### Step 2 — Setup Global Styles

Implementasikan design tokens.

### Step 3 — Setup Dashboard Layout

Buat:

```
src/app/(dashboard)/layout.tsx
```

### Step 4 — Implement Sidebar

Komponen:

```
src/components/layout/app-sidebar.tsx
```

### Step 5 — Implement Header

Komponen:

```
src/components/layout/app-header.tsx
```

### Step 6 — Setup Page Routes

Buat placeholder:

- Dashboard.
- News.
- Sources.
- Scraping.
- Categories.
- Settings.

### Step 7 — Reusable UI

Implementasikan komponen dasar.

## 4. Expected Deliverables

- Application shell.
- Responsive sidebar.
- Header.
- Navigation.
- Global styles.
- Basic page routing.
- Reusable components.

## 5. AI Coding Assistant Prompt

# PHASE 4 — Frontend Foundation & Application Shell

Kamu bertindak sebagai Senior Frontend Developer.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/UI_UX_GUIDE.md

## Objective

Implementasikan frontend foundation dan application shell.

## Tasks

1. Review existing code.
2. Implementasikan folder structure final.
3. Implementasikan global styles.
4. Implementasikan design tokens.
5. Implementasikan dashboard layout.
6. Implementasikan sidebar.
7. Implementasikan header.
8. Implementasikan responsive navigation.
9. Implementasikan reusable components.
10. Buat seluruh basic route.
11. Implementasikan page header.
12. Implementasikan loading dan empty state dasar.

## Expected Files

- src/app/(dashboard)/layout.tsx
- src/components/layout/
- src/components/ui/
- src/components/shared/
- src/app/(dashboard)/page.tsx
- src/app/(dashboard)/news/
- src/app/(dashboard)/sources/
- src/app/(dashboard)/scraping/
- src/app/(dashboard)/categories/
- src/app/(dashboard)/settings/

## Restrictions

- Jangan implementasikan API.
- Jangan implementasikan scraper.
- Jangan membuat database.
- Jangan menggunakan production mock data.
- Placeholder content hanya diperbolehkan untuk layout.
- Jangan melanjutkan Phase 5.

## Verification

- npm run lint
- npx tsc --noEmit
- npm run build

Periksa desktop, tablet, dan mobile.

## Completion Report

Laporkan file, komponen, routes, testing, dan known issues.

Berhenti setelah Phase 4.

## 6. Acceptance Criteria

- Sidebar berfungsi.
- Navigation berfungsi.
- Semua route dapat dibuka.
- Responsive.
- Design tokens diterapkan.
- Komponen reusable.
- Tidak ada business logic scraper.

## 7. Testing Requirements

```
npm run lint
npx tsc --noEmit
npm run build
```

Lakukan visual review.

## 8. Git Checkpoint

```
git add .
git commit -m "phase 4: frontend foundation"
```

# PHASE 5 — Core Frontend Feature Development

Core UI

## 1. Phase Objective

Mengimplementasikan seluruh interface fitur utama menggunakan data kontrak dan mock sementara.

## 2. Scope of Work

- Dashboard UI.
- News Explorer.
- News Detail.
- Sources Management.
- Scraping Monitor.
- Scraping Logs.
- Categories.
- Search.
- Filter.
- Pagination.
- Export UI.
- Form validation.
- Zustand jika memang diperlukan.

## 3. Detailed Implementation Steps

### Step 1 — Dashboard

Implementasikan:

- Stat cards.
- News trend chart.
- Category distribution.
- Latest news.
- Scraper status.

### Step 2 — News Explorer

Implementasikan:

- Search.
- Filter.
- Sort.
- Pagination.
- News table.

### Step 3 — News Detail

Tampilkan:

- Title.
- Source.
- Publication date.
- Category.
- Description.
- Original article link.

### Step 4 — Sources Management

Form:

- Source name.
- Base URL.
- Feed URL.
- Source type.
- Scrape frequency.
- Active status.

### Step 5 — Scraping Monitor

Tampilkan:

- Run scraper.
- Job status.
- Last run.
- Job history.
- Error indicators.

### Step 6 — Logs

Tampilkan:

- Time.
- Source.
- Level.
- Message.

### Step 7 — Mock Data

Gunakan mock repository yang terisolasi.

Contoh:

```
src/features/news/mocks/
src/features/sources/mocks/
src/features/scraping/mocks/
```

Jangan mencampur mock dengan production service.

## 4. Expected Deliverables

Seluruh core frontend siap diintegrasikan.

## 5. AI Coding Assistant Prompt

# PHASE 5 — Core Frontend Feature Development

Kamu bertindak sebagai Senior Frontend Developer.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/UI_UX_GUIDE.md

## Objective

Implementasikan seluruh core frontend features.

## Tasks

1. Implementasikan Dashboard.
2. Implementasikan News Explorer.
3. Implementasikan News Detail.
4. Implementasikan Sources Management.
5. Implementasikan Scraping Monitor.
6. Implementasikan Scraping Logs.
7. Implementasikan Category interface.
8. Implementasikan search.
9. Implementasikan filter.
10. Implementasikan pagination.
11. Implementasikan forms.
12. Implementasikan client validation.
13. Implementasikan loading, empty, error, success states.
14. Buat mock data terisolasi.
15. Pastikan komponen reusable.

## Data Requirements

Gunakan data contract sesuai TECHNICAL_PLAN.md.

Mock data hanya digunakan untuk frontend development.

Beri label MOCK pada implementasi sementara.

## Restrictions

- Jangan implementasikan database.
- Jangan implementasikan scraping engine.
- Jangan membuat API production.
- Jangan menyembunyikan mock dalam production service.
- Jangan mengklaim data mock sebagai data nyata.
- Jangan melanjutkan Phase 6.

## Verification

- npm run lint
- npx tsc --noEmit
- npm run build

Uji seluruh interaction.

## Completion Report

Laporkan:

- Features.
- Components.
- Routes.
- Mock data.
- Validation.
- Testing.
- Known issues.

Berhenti setelah Phase 5.

## 6. Acceptance Criteria

- Dashboard lengkap.
- News Explorer berfungsi.
- Search berfungsi.
- Filter berfungsi.
- Pagination berfungsi.
- Sources form berfungsi.
- Scraping Monitor tersedia.
- Logs tersedia.
- Semua mock diberi batas jelas.
- Loading/error/empty states tersedia.

## 7. Testing Requirements

- Form validation.
- Search interaction.
- Filter interaction.
- Pagination.
- Responsive layout.
- Typecheck.
- Build.

## 8. Git Checkpoint

```
git add .
git commit -m "phase 5: core frontend features"
```

# PHASE 6 — Backend & Core Business Logic

Critical Phase — Scraper Engine

## 1. Phase Objective

Mengimplementasikan backend, database, scraper engine, worker, dan scheduled scraping.

Phase ini merupakan tahap teknis terpenting dalam PovertyWatch.

## 2. Scope of Work

- PostgreSQL integration.
- Prisma schema.
- Database migration.
- Seed categories.
- News source repository.
- News repository.
- RSS scraper.
- HTML scraper.
- News normalization.
- Deduplication.
- Keyword filtering.
- Scraping jobs.
- Worker.
- Scheduler.
- API endpoints.
- Security.
- Logging.

## 3. Detailed Implementation Steps

### Step 1 — Install Dependencies

```
npm install prisma @prisma/client
npm install rss-parser cheerio node-cron pino
npm install zod
```

Gunakan package yang sesuai dengan versi Node.js dan Prisma yang dipilih pada Phase 2.

### Step 2 — Initialize Prisma

```
npx prisma init
```

Konfigurasi:

```
DATABASE_URL=postgresql://user:password@localhost:5432/povertywatch
```

### Step 3 — Create Database Schema

Buat model:

- NewsSource.
- News.
- Category.
- NewsKeyword.
- ScrapingJob.
- ScrapingLog.

Tambahkan field operasional yang diperlukan, seperti:

- Last run.
- Job lock.
- Attempt count.
- Error details.

### Step 4 — Migration

```
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5 — Seed Categories

Kategori awal:

1. Kemiskinan.
2. Perumahan.
3. Pendidikan.
4. Kesehatan.
5. Ketenagakerjaan.
6. Pangan.
7. Perlindungan Sosial.
8. Bencana.

Keyword awal:

```
kemiskinan
miskin ekstrem
rumah tidak layak huni
RTLH
permukiman kumuh
anak putus sekolah
stunting
gizi buruk
pengangguran
PHK
rawan pangan
bansos
bantuan sosial
banjir
kebakaran
```

Seed harus idempotent.

### Step 6 — Implement RSS Scraper

Alur:

```
Fetch RSS
   ↓
Parse XML
   ↓
Validate Item
   ↓
Normalize
   ↓
Deduplicate
   ↓
Persist
```

### Step 7 — Implement HTML Scraper

Konfigurasi source:

```
interface HtmlScraperConfig {
  articleSelector: string;
  titleSelector: string;
  linkSelector: string;
  dateSelector?: string;
  descriptionSelector?: string;
}
```

Jangan mengasumsikan seluruh portal berita menggunakan struktur HTML yang sama.

### Step 8 — Implement URL Normalization

Normalisasi:

- Remove tracking parameters yang diketahui.
- Normalize trailing slash.
- Normalize hostname.
- Remove fragments.
- Preserve query parameters yang berpengaruh terhadap identitas artikel.

Jangan menghapus semua query parameter secara membabi buta.

### Step 9 — Implement Deduplication

Prioritas:

1. Normalized URL.
2. Existing unique constraint.
3. Optional content fingerprint pada pengembangan berikutnya.

### Step 10 — Implement Keyword Matching

Implementasikan:

```
function matchNewsKeywords(
  text: string,
  keywords: string[]
): string[];
```

Gunakan hasil matching sebagai indikator relevansi, bukan bukti bahwa artikel pasti membahas kemiskinan.

### Step 11 — Implement Background Worker

Worker menjalankan:

```
npm run worker
```

Tambahkan script:

```
{
  "scripts": {
    "worker": "tsx worker/index.ts"
  }
}
```

Install `tsx` jika belum tersedia:

```
npm install -D tsx
```

### Step 12 — Implement Scheduler

Jalankan scheduler berdasarkan konfigurasi sumber.

Pastikan:

- Timezone Asia/Jakarta.
- Job locking.
- No duplicate execution.
- Error recovery.
- Graceful shutdown.

### Step 13 — Implement API

Implementasikan:

- News API.
- Sources API.
- Scraping API.
- Dashboard API.
- Categories API.

### Step 14 — Implement Security

Prioritaskan:

- SSRF prevention.
- URL validation.
- Authentication.
- Rate limiting.
- Request validation.
- Secure logging.

### Step 15 — Implement Logging

Setiap job mencatat:

- Started.
- Completed.
- Failed.
- Total found.
- Total new.
- Total duplicate.
- Total failed.

## 4. External Services

Untuk MVP:

- RSS feeds.
- Portal berita publik.
- PostgreSQL.

AI provider belum wajib.

## 5. Expected Deliverables

- Prisma schema.
- Database migration.
- Seed script.
- Repository layer.
- RSS scraper.
- HTML scraper.
- Worker.
- Scheduler.
- API.
- Logging.
- Security validation.

## 6. AI Coding Assistant Prompt

# PHASE 6 — Backend & Core Business Logic

Kamu bertindak sebagai Senior Backend Engineer dan Software Architect.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md

## Objective

Implementasikan backend dan News Scraper Engine PovertyWatch.

Ini merupakan phase inti project.

## Tasks

### Database

1. Setup PostgreSQL.
2. Setup Prisma.
3. Implementasikan seluruh model.
4. Implementasikan relationships.
5. Implementasikan indexes.
6. Implementasikan unique constraints.
7. Buat migration.
8. Buat idempotent seed.

### Scraper

9. Implementasikan RSS scraper.
10. Implementasikan HTML scraper.
11. Implementasikan source configuration.
12. Implementasikan URL normalization.
13. Implementasikan duplicate detection.
14. Implementasikan keyword matching.
15. Implementasikan article validation.
16. Implementasikan timeout.
17. Implementasikan retry terbatas.
18. Implementasikan concurrency limit.

### Worker

19. Implementasikan Node.js worker.
20. Implementasikan PostgreSQL job polling.
21. Implementasikan job locking.
22. Implementasikan scheduler.
23. Implementasikan scheduled scraping.
24. Implementasikan manual scraping trigger.
25. Implementasikan graceful shutdown.
26. Implementasikan failed job recovery.

### API

27. Implementasikan API sesuai technical plan.
28. Implementasikan request validation.
29. Implementasikan pagination.
30. Implementasikan filtering.
31. Implementasikan CSV export.

### Security

32. Implementasikan SSRF protection.
33. Validasi redirect.
34. Blokir private IP.
35. Implementasikan endpoint authentication.
36. Implementasikan rate limiting.
37. Implementasikan structured logging.

## Critical Requirements

- RSS scraper harus benar-benar mengambil feed.
- HTML scraper harus menggunakan selector konfigurasi.
- Data harus benar-benar masuk PostgreSQL.
- Duplicate URL tidak boleh membuat record baru.
- Satu sumber gagal tidak boleh menghentikan semua sumber.
- Worker harus terpisah dari Next.js runtime.
- AI API tidak boleh menjadi dependency wajib.
- Jangan menyimpan konten artikel penuh tanpa dasar izin yang sesuai.
- Hormati robots.txt dan ketentuan sumber.
- Jangan melakukan scraping secara agresif.

## Testing

Gunakan RSS fixture dan HTML fixture lokal.

Jangan bergantung sepenuhnya pada website eksternal untuk unit test.

Buat integration test menggunakan database test.

Jalankan:

- npm run lint
- npx tsc --noEmit
- npm test
- npx prisma validate

## Restrictions

- Jangan mengimplementasikan dashboard frontend.
- Jangan mengimplementasikan AI classification dahulu.
- Jangan mengimplementasikan PDF report.
- Jangan mengimplementasikan fitur P2.
- Jangan melanjutkan Phase 7.

## Completion Report

Laporkan:

1. Database schema.
2. Migration.
3. Scraper implementations.
4. Worker architecture.
5. Scheduler.
6. API endpoints.
7. Security measures.
8. Dependency changes.
9. Test results aktual.
10. Known limitations.

Berhenti setelah Phase 6.

## 7. Acceptance Criteria

- PostgreSQL terkoneksi.
- Prisma migration berhasil.
- Seed kategori berhasil.
- RSS scraper berfungsi.
- HTML scraper berfungsi.
- URL normalization berfungsi.
- Deduplication berfungsi.
- Keyword matching berfungsi.
- Worker dapat dijalankan.
- Scheduler berfungsi.
- Manual trigger tersedia.
- Job locking berfungsi.
- Logging berfungsi.
- API berjalan.
- SSRF protection tersedia.
- Endpoint admin terlindungi.

## 8. Testing Requirements

Gunakan fixture lokal:

```
tests/
└── fixtures/
    ├── sample-feed.xml
    ├── sample-news.html
    └── malformed-feed.xml
```

Testing:

- RSS parser.
- HTML parser.
- Duplicate detection.
- Keyword matching.
- URL normalization.
- Worker job lifecycle.
- Database integration.
- API validation.
- Security validation.

## 9. Git Checkpoint

```
git add .
git commit -m "phase 6: backend implementation"
```

# PHASE 7 — Frontend & Backend Integration

End-to-End Integration

## 1. Phase Objective

Menghubungkan seluruh UI dengan backend dan mengganti mock data dengan data aktual.

## 2. Scope of Work

- API integration.
- News data fetching.
- Dashboard statistics.
- Sources management.
- Manual scraping.
- Job monitoring.
- Search.
- Filter.
- Pagination.
- CSV export.
- Error mapping.

## 3. Detailed Implementation Steps

### Step 1 — Create API Client

Gunakan native fetch.

Contoh:

```
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}
```

Sesuaikan error mapping dan parsing response dengan kontrak API yang telah ditetapkan.

### Step 2 — Replace Mock Data

Hapus penggunaan mock pada production flow.

### Step 3 — Integrate News Explorer

Hubungkan:

- Search.
- Date range.
- Category.
- Source.
- Pagination.

### Step 4 — Integrate Dashboard

Dashboard menggunakan agregasi database.

### Step 5 — Integrate Source Management

Implementasikan create, update, delete, dan active status.

### Step 6 — Integrate Scraping Monitor

Hubungkan trigger scraping dengan API.

Polling status secara berkala dengan interval wajar dan cleanup ketika komponen tidak lagi aktif.

### Step 7 — Integrate CSV Export

Gunakan endpoint export.

### Step 8 — Test Full User Flow

Lakukan end-to-end testing.

## 4. Expected Deliverables

- Live API integration.
- Actual database data.
- Functional dashboard.
- Functional News Explorer.
- Functional Sources.
- Functional Scraping Monitor.
- Functional export.

## 5. AI Coding Assistant Prompt

# PHASE 7 — Frontend & Backend Integration

Kamu bertindak sebagai Senior Fullstack Developer.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/UI_UX_GUIDE.md

## Objective

Hubungkan frontend PovertyWatch dengan backend yang telah selesai.

## Tasks

1. Review seluruh API.
2. Review frontend feature.
3. Buat API client.
4. Ganti mock data dengan API nyata.
5. Integrasikan dashboard statistics.
6. Integrasikan News Explorer.
7. Integrasikan search dan filter.
8. Integrasikan pagination.
9. Integrasikan News Detail.
10. Integrasikan Sources Management.
11. Integrasikan Manual Scraping.
12. Integrasikan Scraping Monitor.
13. Integrasikan Scraping Logs.
14. Integrasikan CSV Export.
15. Implementasikan loading states.
16. Implementasikan error mapping.
17. Implementasikan retry jika relevan.
18. Pastikan state synchronization benar.

## Critical Requirements

Tidak boleh ada mock data yang digunakan sebagai sumber data production.

Setiap halaman harus menggunakan data backend.

Jangan mengklaim scraping berhasil sebelum backend mengonfirmasi job.

Gunakan status job dari database.

## Restrictions

- Jangan mengubah database schema tanpa alasan.
- Jangan mengubah API contract tanpa dokumentasi.
- Jangan menambahkan fitur P2.
- Jangan melakukan redesign besar.
- Jangan melanjutkan Phase 8.

## Verification

Uji:

- Add source.
- Update source.
- Run scraping.
- Read scraping status.
- View news.
- Search.
- Filter.
- Pagination.
- Export.

Jalankan lint, typecheck, tests, dan build.

## Completion Report

Laporkan fitur yang telah terintegrasi, API yang digunakan, mock yang dihapus, hasil pengujian aktual, dan known issues.

Berhenti setelah Phase 7.

## 6. Acceptance Criteria

- Mock data production dihapus.
- Dashboard memakai database.
- News Explorer memakai API.
- Filter berfungsi.
- Search berfungsi.
- Pagination berfungsi.
- Source management berfungsi.
- Manual scraping berfungsi.
- Scraping status tampil.
- CSV export berfungsi.
- Error handling berfungsi.

## 7. Testing Requirements

End-to-end:

```
Create Source
    ↓
Run Scraper
    ↓
Worker Processes Feed
    ↓
Save News
    ↓
Dashboard Updates
    ↓
News Explorer Displays Result
    ↓
Export CSV
```

## 8. Git Checkpoint

```
git add .
git commit -m "phase 7: frontend backend integration"
```

# PHASE 8 — Additional Features & Product Completion

Product Enhancement

## 1. Phase Objective

Menyelesaikan fitur pendukung P1 dan meningkatkan kualitas pengalaman produk.

## 2. Scope of Work

Prioritas:

1. AI Classification.
2. AI Summary.
3. Location Extraction.
4. Trend Monitoring.
5. Excel Export.
6. PDF Report.
7. Source Health Monitoring.

## 3. Implementation Priority

### Step 1 — AI Provider Abstraction

Gunakan interface sederhana:

```
interface AIProvider {
  classifyNews(input: string): Promise<ClassificationResult>;
  summarizeNews(input: string): Promise<SummaryResult>;
}
```

Tidak perlu membuat framework multi-provider kompleks.

### Step 2 — AI Classification

Output:

```
interface ClassificationResult {
  category: string;
  confidence: number;
  reason: string;
}
```

Gunakan structured output dan Zod validation.

### Step 3 — AI Summary

Ringkasan maksimal 2–4 kalimat sebagai default.

### Step 4 — Location Extraction

Identifikasi:

- Kota.
- Kecamatan.
- Kelurahan jika tersedia.

Jangan memaksakan lokasi jika tidak ditemukan.

### Step 5 — Trend Monitoring

Tampilkan grafik:

- Berita per minggu.
- Berita per bulan.
- Kategori terpopuler.
- Perubahan jumlah berita.

### Step 6 — Excel Export

Gunakan library XLSX yang telah diverifikasi kompatibilitas dan keamanannya.

### Step 7 — PDF Report

Buat laporan dengan:

- Periode.
- Ringkasan pengumpulan.
- Statistik kategori.
- Daftar berita.
- Sumber.
- Disclaimer.

### Step 8 — Source Health

Tampilkan:

- Last successful run.
- Last failure.
- Error rate.
- Status sumber.

## 4. Expected Deliverables

- AI classification.
- AI summary.
- Location extraction.
- Trend charts.
- Excel export.
- PDF export.
- Source health monitoring.

## 5. AI Coding Assistant Prompt

# PHASE 8 — Additional Features & Product Completion

Kamu bertindak sebagai Senior Fullstack Developer.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/UI_UX_GUIDE.md

## Objective

Implementasikan fitur pendukung P1.

## Priority

1. AI Classification.
2. AI Summary.
3. Location Extraction.
4. Trend Monitoring.
5. Excel Export.
6. PDF Report.
7. Source Health Monitoring.

## Tasks

1. Review fitur MVP yang sudah berjalan.
2. Implementasikan AI provider integration.
3. Buat schema validation untuk output AI.
4. Implementasikan classification.
5. Implementasikan summary.
6. Implementasikan location extraction.
7. Simpan AI metadata.
8. Implementasikan trend aggregation.
9. Implementasikan Excel export.
10. Implementasikan PDF report.
11. Implementasikan source health monitoring.

## Critical Requirements

- AI merupakan fitur opsional.
- AI failure tidak boleh menghentikan scraper.
- Hasil AI harus ditandai sebagai hasil otomatis.
- Confidence bukan probabilitas statistik terkalibrasi.
- Jangan mengarang lokasi.
- Jangan mengklaim berita sebagai statistik resmi.
- Setiap laporan wajib mencantumkan disclaimer.
- Jangan memproses data sensitif yang tidak diperlukan.

## Restrictions

- Jangan mengimplementasikan fitur P2.
- Jangan membuat multi-region system.
- Jangan membuat notification system.
- Jangan melakukan refactoring besar tanpa alasan.
- Jangan melanjutkan Phase 9.

## Verification

Uji:

- AI unavailable.
- AI invalid response.
- Classification success.
- Summary success.
- Location unavailable.
- Trend aggregation.
- Excel export.
- PDF export.

## Completion Report

Laporkan fitur, dependency, AI provider, biaya/performance considerations, testing results, dan limitations.

Berhenti setelah Phase 8.

## 6. Acceptance Criteria

- AI classification berjalan.
- AI summary berjalan.
- AI failure tidak mengganggu scraper.
- Location extraction tersedia.
- Trend chart berfungsi.
- Excel export berjalan.
- PDF export berjalan.
- Source health tersedia.
- Disclaimer tersedia.

## 7. Testing Requirements

Uji AI menggunakan mocked provider dan minimal satu integration test terhadap provider nyata jika kredensial tersedia.

Jangan membuat klaim bahwa AI telah berhasil diuji dengan provider nyata apabila belum dilakukan.

## 8. Git Checkpoint

```
git add .
git commit -m "phase 8: additional features"
```

# PHASE 9 — Testing, Security & Optimization

Quality Assurance

## 1. Phase Objective

Memastikan PovertyWatch stabil, aman, dan siap digunakan di production.

Output:

`docs/TEST_REPORT.md`

## 2. Scope of Work

- Unit tests.
- Integration tests.
- End-to-end tests.
- Type checking.
- Lint.
- Build.
- Security review.
- Performance review.
- Responsive testing.
- Browser testing.
- Scraper reliability testing.

## 3. Detailed Implementation Steps

### Step 1 — Unit Testing

Prioritas:

- URL normalization.
- RSS parsing.
- HTML parsing.
- Deduplication.
- Keyword matching.
- Category matching.
- Data validation.

Gunakan Vitest atau test framework yang telah dipilih dalam technical plan.

### Step 2 — Integration Testing

Test:

- Database repositories.
- Scraping job lifecycle.
- Worker.
- API.
- Source management.
- Export.

### Step 3 — E2E Testing

Gunakan Playwright.

```
npm install -D @playwright/test
npx playwright install
```

### Step 4 — Type Checking

```
npx tsc --noEmit
```

### Step 5 — Lint

```
npm run lint
```

### Step 6 — Production Build

```
npm run build
```

### Step 7 — Security Audit

```
npm audit
```

Periksa:

- SSRF.
- Authentication.
- Rate limiting.
- Environment secrets.
- SQL injection.
- XSS.
- CSRF.
- Export injection.
- Unsafe URL redirects.

### Step 8 — Performance

Periksa:

- Dashboard query.
- Pagination.
- Database indexing.
- API latency.
- Scraper concurrency.
- Worker memory usage.

### Step 9 — Reliability

Simulasikan:

- Source unavailable.
- Database unavailable.
- Worker restart.
- Duplicate trigger.
- Invalid feed.
- Malformed HTML.
- AI unavailable.

## 4. Expected Deliverables

`docs/TEST_REPORT.md`

Berisi:

- Test summary.
- Test coverage.
- Unit test results.
- Integration test results.
- E2E results.
- Security review.
- Performance findings.
- Known issues.
- Release readiness.

## 5. AI Coding Assistant Prompt

# PHASE 9 — Testing, Security & Optimization

Kamu bertindak sebagai Senior QA Engineer dan Application Security Engineer.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/UI_UX_GUIDE.md

## Objective

Lakukan quality assurance menyeluruh sebelum production release.

Output:\
docs/TEST_REPORT.md

## Tasks

1. Audit seluruh fitur.
2. Jalankan unit testing.
3. Jalankan integration testing.
4. Jalankan E2E testing.
5. Jalankan typecheck.
6. Jalankan lint.
7. Jalankan production build.
8. Review scraper reliability.
9. Review worker lifecycle.
10. Review database indexes.
11. Review API security.
12. Review SSRF protection.
13. Review authentication.
14. Review rate limiting.
15. Review environment secrets.
16. Review XSS dan CSRF.
17. Review CSV formula injection.
18. Review responsive design.
19. Review browser compatibility.
20. Review performance.
21. Perbaiki bug yang ditemukan.
22. Buat TEST_REPORT.md.

## Critical Requirements

Jangan mengarang hasil testing.

Setiap hasil harus berasal dari command atau test yang benar-benar dijalankan.

Pisahkan:

- Passed.
- Failed.
- Skipped.
- Not Tested.

Jangan menambahkan fitur baru.

Jangan mengubah scope MVP.

Jangan melanjutkan Phase 10 sebelum semua critical issue ditangani.

## Verification

Jalankan seluruh test suite.

Catat command dan output ringkas.

## Completion Report

Berikan:

1. Testing summary.
2. Passed tests.
3. Failed tests.
4. Security findings.
5. Performance findings.
6. Fixed issues.
7. Remaining issues.
8. Production readiness recommendation.

Berhenti setelah Phase 9.

## 6. Acceptance Criteria

- Unit tests lulus.
- Integration tests lulus.
- E2E core flow lulus.
- Typecheck lulus.
- Lint lulus.
- Build lulus.
- SSRF protection diverifikasi.
- Authentication diverifikasi.
- Scraper reliability diuji.
- Responsive diuji.
- Test report tersedia.
- Tidak ada critical security issue terbuka.

## 7. Testing Requirements

```
npm run lint
npx tsc --noEmit
npm test
npm run build
npm audit
```

Tambahkan perintah E2E sesuai script project.

## 8. Git Checkpoint

```
git add .
git commit -m "phase 9: testing and optimization"
```

# PHASE 10 — Production Deployment & Release

Production Release

## 1. Phase Objective

Melakukan deployment PovertyWatch ke production.

Output:

- `docs/DEPLOYMENT_GUIDE.md`
- `docs/RELEASE_NOTES.md`

## 2. Deployment Architecture

Rekomendasi:

- VPS Linux.
- Docker Compose.
- Next.js application container.
- Worker container.
- PostgreSQL container.
- Nginx reverse proxy.
- HTTPS.

## 3. System Topology

## Production Architecture

Internet

Domain + HTTPS

Nginx Reverse Proxy

Next.js

Web + API

Worker

Scraping + Scheduler

PostgreSQL

Persistent Database Volume

## 4. Detailed Implementation Steps

### Step 1 — Prepare VPS

Gunakan Ubuntu Server LTS atau distribusi Linux yang didukung.

Update:

```
sudo apt update
sudo apt upgrade -y
```

Install Docker Engine dan Docker Compose Plugin mengikuti dokumentasi resmi Docker.

Verifikasi:

```
docker --version
docker compose version
```

### Step 2 — Prepare Production Environment

Buat `.env.production`.

Contoh:

```
NODE_ENV=production

DATABASE_URL=postgresql://povertywatch:SECURE_PASSWORD@db:5432/povertywatch

ADMIN_SESSION_SECRET=CHANGE_THIS_SECRET

AI_API_KEY=
AI_PROVIDER=

SCRAPER_USER_AGENT=PovertyWatchBot/1.0

NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Gunakan secret yang kuat.

### Step 3 — Dockerfile

Buat multi-stage Dockerfile.

Pastikan:

- Dependency production.
- Prisma client generated.
- Build Next.js.
- Non-root user.
- Worker dapat dijalankan secara terpisah dari image yang sama.

### Step 4 — Docker Compose

Service:

```
app
worker
db
```

Konfigurasi:

- Restart policy.
- Healthcheck.
- Database volume.
- Internal network.
- Resource limits yang sesuai.
- Environment separation.

### Step 5 — Database Migration

Jalankan migration menggunakan mekanisme release/deployment satu kali.

```
npx prisma migrate deploy
```

Jangan menjalankan migration bersamaan dari setiap replica aplikasi.

### Step 6 — Reverse Proxy

Konfigurasi Nginx.

Domain:

```
povertywatch.example.com
```

Forward ke Next.js:

```
localhost:3000
```

### Step 7 — HTTPS

Gunakan Let's Encrypt melalui Certbot atau mekanisme TLS yang sesuai.

### Step 8 — Deploy

```
docker compose build
docker compose up -d
```

### Step 9 — Production Smoke Test

Periksa:

- Website accessible.
- Database connected.
- API responding.
- Worker running.
- Scheduler active.
- Scraper functional.
- News visible.
- Export working.

### Step 10 — Monitoring

Minimal:

- Container status.
- Application logs.
- Worker logs.
- Database health.
- Disk usage.
- Backup status.
- SSL expiration.

### Step 11 — Backup

Lakukan backup PostgreSQL secara berkala.

Contoh:

```
docker compose exec -T db \
  pg_dump -U povertywatch povertywatch \
  > povertywatch-backup.sql
```

Simpan backup di lokasi terpisah dan uji proses restore secara berkala. Backup pada disk VPS yang sama saja tidak cukup.

## 5. Expected Deliverables

```
docs/
├── DEPLOYMENT_GUIDE.md
└── RELEASE_NOTES.md
```

## 6. AI Coding Assistant Prompt

# PHASE 10 — Production Deployment & Release

Kamu bertindak sebagai Senior DevOps Engineer dan Release Manager.

Project: PovertyWatch

Dokumen:

- PROJECT_PRD_AND_PLAYBOOK.md
- docs/TECHNICAL_PLAN.md
- docs/TEST_REPORT.md

## Objective

Deploy PovertyWatch ke production.

## Tasks

1. Review production readiness.
2. Review test report.
3. Setup production environment.
4. Siapkan Dockerfile.
5. Siapkan Docker Compose.
6. Konfigurasikan Next.js application.
7. Konfigurasikan worker.
8. Konfigurasikan PostgreSQL.
9. Konfigurasikan persistent volume.
10. Konfigurasikan Nginx.
11. Konfigurasikan domain.
12. Konfigurasikan HTTPS.
13. Jalankan database migration.
14. Deploy application.
15. Deploy worker.
16. Verifikasi scheduler.
17. Verifikasi scraping.
18. Verifikasi database persistence.
19. Setup monitoring.
20. Setup backup.
21. Jalankan production smoke test.
22. Buat DEPLOYMENT_GUIDE.md.
23. Buat RELEASE_NOTES.md.

## Deployment Requirements

Gunakan arsitektur web application.

Next.js dan worker merupakan proses berbeda.

PostgreSQL harus menggunakan persistent volume.

Jangan mengekspos database ke public internet.

Jangan menyimpan secret dalam repository.

Jangan melakukan deployment tanpa backup dan rollback plan yang jelas.

## Restrictions

- Jangan mengubah fitur MVP.
- Jangan melakukan redesign.
- Jangan mengganti arsitektur tanpa persetujuan.
- Jangan menghapus data production.
- Jangan mengklaim deployment berhasil jika belum diverifikasi.
- Jangan melanjutkan ke phase lain.

## Expected Documentation

DEPLOYMENT_GUIDE.md:

- Infrastructure.
- Environment variables.
- Docker setup.
- Database setup.
- Domain.
- HTTPS.
- Deployment steps.
- Monitoring.
- Backup.
- Restore.
- Rollback.

RELEASE_NOTES.md:

- Version.
- Release date.
- Features.
- Improvements.
- Known issues.
- Limitations.

## Completion Report

Laporkan:

1. Deployment architecture.
2. Production URL.
3. Services status.
4. Database status.
5. Worker status.
6. Scheduler status.
7. Smoke test results.
8. Backup strategy.
9. Rollback strategy.
10. Known limitations.

Jangan mengarang URL atau status deployment.

Berhenti setelah Phase 10.

## 7. Acceptance Criteria

- VPS siap.
- Docker berjalan.
- Next.js container berjalan.
- Worker container berjalan.
- PostgreSQL berjalan.
- Database persistent.
- Migration berhasil.
- Domain aktif.
- HTTPS aktif.
- API dapat diakses.
- Scraper berjalan.
- Scheduler berjalan.
- Backup tersedia.
- Restore plan tersedia.
- Deployment guide tersedia.
- Release notes tersedia.

## 8. Testing Requirements

Production smoke test:

```
Open Website
    ↓
Login Operator
    ↓
Open Sources
    ↓
Verify Sources
    ↓
Trigger Scraper
    ↓
Wait for Worker
    ↓
Verify Database
    ↓
Open News Explorer
    ↓
Search News
    ↓
Export CSV
```

## 9. Git Checkpoint

```
git add .
git commit -m "phase 10: production deployment"
```

# PART C — GLOBAL AI CODING RULES

Aturan ini berlaku untuk seluruh phase.

## C.1 General Rules

1. Selalu baca PRD sebelum melakukan perubahan.
2. Baca technical plan setelah tersedia.
3. Baca UI guide saat mengerjakan frontend.
4. Kerjakan hanya phase yang diminta.
5. Periksa struktur repository.
6. Jangan menimpa pekerjaan sebelumnya tanpa alasan.
7. Jangan mengubah stack tanpa persetujuan.
8. Jangan menambahkan dependency tanpa kebutuhan.
9. Jangan membuat fitur di luar scope.
10. Jangan membuat asumsi yang tidak terdokumentasi.

## C.2 Development Rules

- Gunakan TypeScript.
- Hindari `any`.
- Pisahkan UI dan business logic.
- Gunakan reusable components.
- Gunakan Zod untuk input validation.
- Gunakan Prisma untuk database access.
- Gunakan server-side code untuk secret dan database.
- Hindari duplikasi logic.
- Gunakan naming convention konsisten.
- Jangan membuat abstraction berlebihan.

## C.3 Scraper Rules

- Prioritaskan RSS.
- Hormati robots.txt.
- Hormati terms of service.
- Gunakan timeout.
- Gunakan concurrency limit.
- Gunakan retry terbatas.
- Catat setiap error.
- Terapkan deduplication.
- Jangan menganggap semua website kompatibel.
- Jangan bypass proteksi.
- Jangan mengambil data di balik login.
- Jangan menyimpan full article tanpa dasar izin.

## C.4 AI Rules

- AI bukan sumber kebenaran.
- AI output wajib divalidasi.
- AI failure tidak boleh menghentikan scraper.
- Jangan mengarang informasi lokasi.
- Jangan menyajikan klasifikasi AI sebagai fakta terverifikasi.
- Simpan sumber asli.
- Sediakan provenance.

## C.5 Testing Rules

Jangan mengklaim testing berhasil tanpa menjalankan command.

Format laporan:

```
Test:
Command:
Result:
Evidence:
Issues:
```

## C.6 Phase Completion Report

Setiap phase wajib melaporkan:

```
PHASE REPORT

Phase:
Status:

1. Summary
2. Implemented Features
3. Files Created
4. Files Modified
5. Dependencies Added
6. Commands Executed
7. Testing Results
8. Acceptance Criteria
9. Known Issues
10. Git Checkpoint
11. Recommendation

Next Phase:
Not started.
```

# PART D — GIT & EXECUTION RULES

## D.1 Branch Strategy

Untuk solo developer, gunakan:

```
main
development
```

Atau cukup `main` jika ingin workflow lebih sederhana.

Tidak wajib membuat banyak feature branch.

## D.2 Commit Strategy

Setiap phase memiliki satu Git checkpoint utama.

| Phase | Commit                                  |
| ----- | --------------------------------------- |
| 1     | `phase 1: project bootstrap`            |
| 2     | `phase 2: technical architecture`       |
| 3     | `phase 3: ui ux planning`               |
| 4     | `phase 4: frontend foundation`          |
| 5     | `phase 5: core frontend features`       |
| 6     | `phase 6: backend implementation`       |
| 7     | `phase 7: frontend backend integration` |
| 8     | `phase 8: additional features`          |
| 9     | `phase 9: testing and optimization`     |
| 10    | `phase 10: production deployment`       |

## D.3 Commit Commands

Setelah seluruh acceptance criteria terpenuhi:

```
git status
git diff --check
git add .
git commit -m "phase 1: project bootstrap"
```

Sesuaikan pesan commit dengan phase yang sedang dikerjakan.

## D.4 Mandatory Rules

- Jangan commit ketika build gagal.
- Jangan commit ketika testing wajib belum dijalankan.
- Jangan commit secret.
- Jangan commit `.env`.
- Jangan menghapus migration sebelumnya.
- Jangan melakukan force push tanpa alasan.
- Jangan memulai phase berikutnya sebelum checkpoint selesai.

## D.5 Git Tag

Setelah production release:

```
git tag -a v1.0.0 -m "PovertyWatch MVP Release"
git push origin v1.0.0
```

# PART E — COMMAND CHEAT SHEET

## E.1 Development

```
npm install
npm run dev
npm run lint
npm run build
```

## E.2 TypeScript

```
npx tsc --noEmit
```

## E.3 Database

```
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
npx prisma studio
```

## E.4 Worker

```
npm run worker
```

## E.5 Testing

```
npm test
npm run test:e2e
```

## E.6 Docker

```
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

Jangan gunakan `docker compose down -v` pada production karena dapat menghapus volume database.

## E.7 Production Inspection

```
docker compose ps
docker compose logs app
docker compose logs worker
docker compose logs db
```

## E.8 Git

```
git status
git add .
git commit -m "phase checkpoint"
git log --oneline
```

# PART F — FINAL CHECKLIST & DOCUMENTATION

## F.1 Development Completion Checklist

Project completion

# 0%

0 dari 44 checklist selesai

Foundation

Next.js project berjalan

TypeScript dan Tailwind terkonfigurasi

shadcn/ui tersedia

Git repository tersedia

Architecture

TECHNICAL_PLAN.md tersedia

Database architecture ditetapkan

Scraper architecture ditetapkan

Worker architecture ditetapkan

Frontend

Dashboard selesai

News Explorer selesai

Sources Management selesai

Scraping Monitor selesai

Responsive layout selesai

Backend

PostgreSQL terhubung

Prisma migration berhasil

RSS scraper berfungsi

HTML scraper berfungsi

Deduplication berfungsi

Scheduler berfungsi

Worker berfungsi

API berfungsi

Integration

Mock production dihapus

Dashboard memakai data aktual

News Explorer memakai API

Manual scraping berfungsi

CSV export berfungsi

Additional Features

AI classification tersedia

AI summary tersedia

Location extraction tersedia

Trend monitoring tersedia

PDF/Excel export tersedia

Quality Assurance

Unit testing lulus

Integration testing lulus

E2E testing lulus

Security review selesai

TEST_REPORT.md tersedia

Production

VPS siap

Docker deployment berhasil

Domain aktif

HTTPS aktif

Worker aktif

Database backup tersedia

DEPLOYMENT_GUIDE.md tersedia

RELEASE_NOTES.md tersedia

Reset checklist

## F.2 Required Documentation

| Document                    | Phase   |
| --------------------------- | ------- |
| PROJECT_PRD_AND_PLAYBOOK.md | Initial |
| TECHNICAL_PLAN.md           | 2       |
| UI_UX_GUIDE.md              | 3       |
| TEST_REPORT.md              | 9       |
| DEPLOYMENT_GUIDE.md         | 10      |
| RELEASE_NOTES.md            | 10      |

## F.3 Final Product Definition

PovertyWatch MVP dinyatakan selesai ketika pengguna dapat:

1. Membuka website PovertyWatch.
2. Melihat dashboard informasi berita.
3. Melihat daftar berita yang dikumpulkan.
4. Menambahkan sumber berita melalui halaman operator.
5. Menjalankan scraping manual.
6. Menunggu worker memproses sumber.
7. Melihat berita baru yang berhasil disimpan.
8. Mencari berita berdasarkan keyword.
9. Memfilter berita berdasarkan kategori dan periode.
10. Melihat riwayat scraping.
11. Mengekspor hasil pemantauan.
12. Mengakses sumber berita asli.

Prioritas pengembangan yang tidak boleh berubah: pengumpulan berita yang andal harus diselesaikan terlebih dahulu sebelum mengembangkan fitur AI dan analisis lanjutan.

# REKOMENDASI EKSEKUSI PROJECT

Untuk menjaga pengembangan tetap realistis sebagai solo developer, berikut urutan fokus yang disarankan:

## Development Roadmap

1. Foundation & Planning

   Phase 1–3: Siapkan project, arsitektur, dan design system.

2. Build the Interface

   Phase 4–5: Bangun dashboard dan seluruh halaman inti.

3. Make Scraping Work

   Prioritas tertinggi

   Phase 6–7: Bangun scraper, scheduler, database, dan integrasi end-to-end.

4. Enhance with AI

   Phase 8: Tambahkan klasifikasi, ringkasan, dan lokasi.

5. Test & Release

   Phase 9–10: Audit, optimasi, deployment, dan production release.

## Catatan arsitektur penting sebelum mulai

Ada tiga keputusan yang sangat penting untuk keberhasilan PovertyWatch:

1\. Jangan bergantung pada scraping HTML saja.

Buat sistem source management yang mendukung RSS dan HTML secara terpisah. Website dapat mengubah struktur HTML sewaktu-waktu, sedangkan RSS biasanya lebih mudah diproses.

2\. Jangan menjadikan AI sebagai bagian wajib dari scraping pipeline.

Simpan berita terlebih dahulu. Klasifikasi dan ringkasan AI dapat diproses kemudian. Dengan begitu, ketika API AI mengalami gangguan atau biaya meningkat, pengumpulan berita tetap berjalan.

3\. Jangan menyamakan jumlah berita dengan tingkat kemiskinan.

Dashboard harus menggunakan istilah seperti jumlah pemberitaan, frekuensi fenomena yang diberitakan, dan tren pemberitaan. Bukan jumlah penduduk miskin atau tingkat kemiskinan.

Rekomendasi saya: selesaikan Phase 1 sampai Phase 7 terlebih dahulu dan jadikan itu sebagai PovertyWatch MVP operasional. Jangan terburu-buru memasukkan semua fitur AI. Keberhasilan utama produk ini justru terletak pada kemampuannya mengumpulkan berita secara konsisten, terstruktur, dan dapat ditelusuri dari berbagai sumber di Kota Medan.
