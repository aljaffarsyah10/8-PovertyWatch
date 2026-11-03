# PovertyWatch — Release Notes

**Versi:** `v1.0.0` (Production MVP Release)  
**Tanggal Rilis:** 4 November 2026  
**Status Produk:** Stable / Production Ready  
**Arsitektur:** Modular Monolith (Next.js 16.4.4 App Router + PostgreSQL + Prisma + Background Ingestion Worker)  

---

## 1. Ikhtisar Produk (Product Vision)

**PovertyWatch** adalah platform pemantauan digital yang dirancang untuk mengumpulkan, memetakan, mengklasifikasikan, dan menganalisis frekuensi pemberitaan kemiskinan serta fenomena sosial ekonomi lokal di wilayah **Kota Medan**, Sumatera Utara.

Platform ini mengubah naskah berita media massa yang tersebar dan tidak terstruktur menjadi dataset terstruktur, transparan, dan dapat ditelusuri (*traceable*) guna mendukung pemantauan atensi publik, perumusan advokasi kebijakan, dan penelitian independen.

---

## 2. Fitur-Fitur Utama (*Key Features Inventory*)

### A. Dashboard Pemantauan Media Interaktif
- **Metrik Utama Agregasi:** Total Berita, Berita 24 Jam Terakhir, Sumber Portal Aktif, dan Tingkat Keberhasilan Scraper.
- **Distribusi Kategori Kemiskinan:** Representasi porsi 8 kategori isu kemiskinan berbasis kata kunci dan analisis NLP.
- **Dinamika Tren Publikasi Mingguan:** Visualisasi bar chart frekuensi liputan berita 8 minggu terakhir beserta indikator perubahan persentase perbandingan periode 30 hari.
- **Sebaran Wilayah Hotspot:** Pemetaan kecamatan di Kota Medan yang paling sering diberitakan.
- **Tautan Cepat Ekspor Laporan:** Tombol unduh laporan berkala langsung dalam format Excel (XLSX) dan PDF resmi.

### B. News Explorer & Filter Multi-Dimensi
- **Pencarian Teks Cepat:** Pencarian kata kunci pada judul, deskripsi, dan lokasi berita.
- **Filter Fleksibel:** Filter menurut 8 Kategori Kemiskinan, Portal Sumber Media, dan 21 Wilayah Kecamatan Kota Medan.
- **Tampilan Ganda:** Mode tabel data komprehensif dan mode kartu (*grid*) yang nyaman untuk dibaca.
- **Halaman Detail Berita (`/news/[id]`):** Menampilkan rincian judul, tanggal terbit, ringkasan AI, alasan klasifikasi, tautan ke portal berita asli, dan *data provenance audit trail* (ID database dan Canonical Normalized URL).

### C. Mesin Ingestion & Scraping Mandiri (*Background Worker*)
- **Dukungan Protokol Ganda:** RSS/Atom Feed Ingestion dan HTML Scraper (CSS Selectors via Cheerio).
- **Protokol Anti-Duplikasi:** Normalisasi URL cerdas yang membuang parameter pelacak (UTM, FBCLID) dan hashing canonical URL unik.
- **Pemisahan Proses:** Background worker berjalan sebagai proses terpisah dari server web Next.js dengan penjadwalan otomatis via `node-cron`.
- **Audit Logs Mendalam (`/scraping/logs`):** Pencatatan riwayat setiap eksekusi scraper, durasi, artikel baru ditemukan, duplikat dilewati, dan log kegagalan.

### D. Fitur Pendukung Cerdas & AI (Phase 8)
- **AI Classification:** Klasifikasi otomatis naskah berita ke dalam 8 kategori kemiskinan dengan skor keyakinan (*confidence score*) dan narasi alasan.
- **AI Summary:** Ringkasan intisari 2–4 kalimat Bahasa Indonesia formal yang menonjolkan aspek kemiskinan dan bantuan sosial.
- **Graceful Fallback:** Sistem beralih otomatis ke *deterministic rule-based provider* jika koneksi LLM eksternal bermasalah, menjamin scraper tidak pernah berhenti.
- **Ekstraksi Wilayah Bertingkat:** Identifikasi cerdas hingga tingkat Kelurahan (misal: Sicanang, Bagan Deli, Kesawan) dan 21 Kecamatan Kota Medan tanpa mengarang lokasi.

### E. Ekspor Multi-Format Lengkap
- **Ekspor CSV (RFC-4180):** Untuk pengolahan data tabular lanjutan dan integrasi data science.
- **Ekspor Excel (XLSX):** Berkas workbook multi-sheet berisi lembar data berita dan lembar resmi *Metodologi & Disclaimer*.
- **Laporan Dokumen PDF:** Format dokumen institusional rapi yang siap dibagikan untuk pelaporan berkala.

### F. Pemantauan Kesehatan Sumber Media (*Source Health*)
- Pelacakan kondisi kesehatan setiap portal media lokal dengan status `HEALTHY`, `DEGRADED`, dan `FAILING`.
- Waktu scrape terakhir dan riwayat pesan error kegagalan.

---

## 3. Aspek Keamanan & Kepatuhan (*Security & Compliance*)

1. **SSRF Guarding:** Memblokir seluruh akses ke loopback (IPv4/IPv6), private subnet RFC 1918, cloud instance metadata (AWS/GCP), dan port layanan internal terbatas.
2. **Formula Injection Sanitization (CWE-1236):** Seluruh sel ekspor CSV dan Excel yang diawali karakter berbahaya (`=`, `+`, `-`, `@`, `\t`, `\r`) secara otomatis dinetralkan.
3. **Pembersihan XSS:** Seluruh tag `<script>` dan atribut event handler dari naskah berita pihak ketiga dibersihkan secara tuntas.
4. **Isolasi Database:** Port PostgreSQL tidak dipublikasikan ke internet; hanya dapat diakses melalui jaringan bridge privat Docker.

---

## 4. Batasan Produk & Panduan Interpretasi (*Important Disclaimers*)

> [!IMPORTANT]
> 1. **Bukan Statistik Resmi BPS:** Angka dan grafik yang ditampilkan dalam PovertyWatch mencerminkan **volume dan frekuensi liputan media massa**, bukan sensus resmi penduduk miskin atau angka kemiskinan makro dari Badan Pusat Statistik (BPS).
> 2. **Skor Keyakinan AI:** Skor confidence AI adalah estimasi heuristik algoritma NLP untuk membantu penyortiran awal, bukan probabilitas statistik matematis terkalibrasi.
> 3. **Hak Cipta Konten Berita:** PovertyWatch hanya menyimpan ringkasan, metadata, dan kutipan singkat artikel. Seluruh hak cipta karya jurnalistik tetap berada pada masing-masing portal media berita terkait.

---

## 5. Ringkasan Pengujian Kualitas (QA Summary)

- **Total Test Suites:** 24 Skenario Pengujian Unit, E2E, Integrasi, dan Keamanan.
- **Hasil:** **100% PASSED (0 Failed, 0 Skipped).**
- **Typecheck & Lint:** **0 Errors, 0 Warnings.**
- **Build Status:** **Kompilasi Turbopack Sukses untuk seluruh 22 rute aplikasi.**
