# POVERTYWATCH — UI/UX SPECIFICATION & DESIGN SYSTEM GUIDE
**Document:** `docs/UI_UX_GUIDE.md`  
**Phase:** Phase 3 (UI/UX Planning & Design System)  
**Version:** 1.0.0  
**Date:** November 2026  
**Status:** Approved UI/UX Design System  

---

## 1. Visual Identity & Design Direction

PovertyWatch mengusung pendekatan desain **Data-Centric Editorial Analytics Dashboard**. Desain dirancang khusus untuk memfasilitasi riset sosial, pemantauan media, dan pemahaman kondisi lokal Kota Medan dengan mengutamakan keterbacaan data (*data readability first*), visual noise yang minimal, serta hierarki informasi yang jernih.

### 1.1 Core Design Pillars
1. **Clarity Over Decoration:**  
   Menghindari elemen dekoratif berlebih, gradasi warna mencolok, atau animasi yang mengalihkan perhatian dari substansi data pemberitaan.
2. **Editorial Seriousness:**  
   Tipografi dan tata letak mencerminkan platform riset dan pemantauan profesional yang kredibel.
3. **Data Integrity & Contextual Clarity:**  
   Setiap grafik, tabel, dan kartu statistik wajib secara eksplisit mencantumkan konteks: *volume pemberitaan*, *frekuensi topik yang diberitakan*, serta *cakupan geografis Kota Medan*, disertai penegasan bahwa data ini bersumber dari media massa publik (bukan statistik resmi sensus penduduk).
4. **Responsive & Accessible:**  
   Pengalaman optimal di desktop, tablet, dan smartphone dengan kepatuhan kontras warna WCAG 2.1 Level AA.

---

## 2. Design Tokens & Color Palette

Sistem warna PovertyWatch menggunakan palet berbasis Slate, Navy, dan Aksen Teal untuk memancarkan aura analitik, presisi, dan ketenangan.

### 2.1 Color Palette Table

| Token Name | Hex Code | HSL / CSS Variable | Tailwind Equivalent | Penggunaan Utama |
|---|---|---|---|---|
| **Primary** | `#0F172A` / `#1E293B` | `222.2 47.4% 11.2%` | `slate-900` / `slate-800` | Header, tombol utama (*primary action*), teks heading utama, sidebar aktif |
| **Secondary** | `#475569` | `215.4 16.3% 46.9%` | `slate-600` | Teks sekunder, label tabel, deskripsi stat card |
| **Accent** | `#0D9488` | `173.4 80.4% 31.8%` | `teal-600` / `teal-500` | Highlight tren, titik data aktif, link interaktif, indikator live |
| **Background** | `#F8FAFC` | `210 40% 98%` | `slate-50` | Latar belakang kanvas aplikasi |
| **Surface (Card)** | `#FFFFFF` | `0 0% 100%` | `white` | Kartu metrik, panel filter, kontainer tabel |
| **Border** | `#E2E8F0` | `214.3 31.8% 91.4%` | `slate-200` | Garis pemisah, border kartu, input border |
| **Muted** | `#F1F5F9` | `210 40% 96.1%` | `slate-100` | Background tag/badge netral, baris hover tabel, skeleton |
| **Success** | `#16A34A` | `142.1 76.2% 36.3%` | `green-600` | Job status COMPLETED, scraper aktif, kenaikan tren positif |
| **Warning** | `#D97706` | `37.7 92.1% 50.2%` | `amber-600` | Job status RUNNING, duplicate threshold warning, alert selector |
| **Danger** | `#DC2626` | `0 84.2% 60.2%` | `red-600` | Job status FAILED, error scraper, aksi destruktif (delete) |

### 2.2 Semantic Category Color Tokens (Taksonomi Kemiskinan)
Setiap kategori fenomena sosial memiliki identitas badge warna yang konsisten:
- **Kemiskinan Ekstrem & Kerawanan Pangan:** `bg-rose-50 text-rose-700 border-rose-200`
- **Rumah Tidak Layak Huni & Permukiman Kumuh:** `bg-amber-50 text-amber-800 border-amber-200`
- **Stunting & Gizi Buruk:** `bg-emerald-50 text-emerald-800 border-emerald-200`
- **Anak Putus Sekolah & Pendidikan:** `bg-blue-50 text-blue-800 border-blue-200`
- **Pengangguran & PHK:** `bg-purple-50 text-purple-800 border-purple-200`
- **Permasalahan Bantuan Sosial (Bansos):** `bg-cyan-50 text-cyan-800 border-cyan-200`
- **Dampak Bencana Kelompok Rentan:** `bg-orange-50 text-orange-800 border-orange-200`

---

## 3. Typography System

Menggunakan font keluarga sans-serif modern berdaya baca tinggi: **Geist Sans** (dengan fallback **Inter, system-ui**).

### 3.1 Typographic Scale

| Level | Size / Line-Height | Weight | Tracking | Penggunaan |
|---|---|---|---|---|
| **Display / H1** | `28px / 36px` (`text-2xl sm:text-3xl`) | Bold (`font-bold`, 700) | `-0.02em` | Page Header judul halaman utama |
| **Section / H2** | `20px / 28px` (`text-xl`) | Semibold (`font-semibold`, 600) | `-0.01em` | Header bagian kartu, judul chart, judul section |
| **Sub-section / H3** | `16px / 24px` (`text-base`) | Semibold (`font-semibold`, 600) | `0em` | Judul artikel berita di card, header modal dialog |
| **Body Default** | `14px / 20px` (`text-sm`) | Normal (`font-normal`, 400) | `0em` | Teks isi tabel, deskripsi artikel, isi paragraf |
| **Body Medium** | `14px / 20px` (`text-sm`) | Medium (`font-medium`, 500) | `0em` | Menu navigasi, label form input, tombol |
| **Small / Caption** | `12px / 16px` (`text-xs`) | Normal (`font-normal`, 400) | `0.01em` | Timestamp berita, nama portal sumber, disclaimer catatan kaki |
| **Stat Metric** | `32px / 38px` (`text-3xl`) | Bold (`font-bold`, 700) | `-0.03em` | Angka total di Stat Card |

---

## 4. Spacing, Elevation & Border Radius

### 4.1 Spacing Grid
- Berbasis modular **4px / 8px grid**:
  - `space-1` = 4px, `space-2` = 8px, `space-3` = 12px, `space-4` = 16px
  - `space-6` = 24px, `space-8` = 32px, `space-12` = 48px
- Margin kontainer utama halaman: `p-4 sm:p-6 lg:p-8`
- Jarak antar kartu grid: `gap-4 sm:gap-6`

### 4.2 Border Radius
- Kontainer Card & Panel: `rounded-xl` (12px)
- Input Field & Buttons: `rounded-lg` (8px)
- Badges & Tags: `rounded-md` (6px) atau `rounded-full` (pill style untuk kategori)

### 4.3 Elevation & Shadows
- **Card Default:** `shadow-xs border border-slate-200/80` (sangat halus, mengutamakan border crisp)
- **Card Hover:** `hover:shadow-md hover:border-slate-300 transition-all duration-150`
- **Modal / Popover:** `shadow-lg border border-slate-200`
- **Dropdown Menu:** `shadow-md border border-slate-200`

---

## 5. Navigation Architecture & Global Shell

### 5.1 Global Navigation Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│ AppHeader: [PovertyWatch Logo]  [Cakupan: Medan]  [Search...]  [Admin] │
├───────────────┬────────────────────────────────────────────────────────┤
│ AppSidebar    │ Main Content Canvas                                    │
│               │                                                        │
│ • Dashboard   │ [Breadcrumb: Home / Dashboard]                         │
│ • News        │                                                        │
│ • Sources     │ [Page Header & Quick Action]                           │
│ • Scraping    │                                                        │
│ • Logs        │ [Content Area: StatCards, Charts, DataTables]          │
│ • Categories  │                                                        │
│ • Settings    │                                                        │
│               │                                                        │
│ [Bot Health]  │                                                        │
└───────────────┴────────────────────────────────────────────────────────┘
```

### 5.2 Sidebar Menu Definition
1. **Public Views (Dapat diakses siapa saja):**
   - **Dashboard (`/`):** Ringkasan metrik volume berita, tren 30 hari, distribusi kategori, dan berita terbaru.
   - **News Explorer (`/news`):** Mesin pencari dan penelusur artikel berita terstruktur dengan filter multi-segi.
   - **Tentang / Metodologi (`/about`):** Penjelasan etika pengumpulan data, cakupan geografis Kota Medan, dan batasan interpretasi.
2. **Operator Views (Terproteksi Autentikasi Session):**
   - **News Sources (`/sources`):** Manajemen portal media lokal (RSS URL, HTML Selector, frekuensi).
   - **Scraping Monitor (`/scraping`):** Kontrol trigger scraping manual, status job aktif, dan metrik kesehatan ingestion.
   - **Scraping Logs (`/scraping/logs`):** Audit trail seluruh request scraping dan error log.
   - **Kategori & Keyword (`/categories`):** Konfigurasi taksonomi 9 isu kemiskinan dan kata kunci pencocokan.
   - **Settings (`/settings`):** Konfigurasi User-Agent bot, timeout, dan retensi data.

### 5.3 Responsive Navigation Rules
- **Desktop (≥ 1024px):** Fixed left sidebar (lebar 256px), header dengan quick stats & search, canvas lebar adaptif.
- **Tablet (768px – 1023px):** Collapsed icon-only sidebar (lebar 72px) dengan tooltip saat hover, atau drawer toggle.
- **Mobile (< 768px):** Header ramping dengan hamburger menu yang memunculkan slide-over navigation drawer (Sheet shadcn).

---

## 6. Page Layout Specifications & ASCII Wireframes

### 6.1 Public Dashboard (`/`)

Tujuan: Memberikan gambaran seketika mengenai dinamika pemberitaan kemiskinan di Kota Medan tanpa bias opini.

```
+---------------------------------------------------------------------------------------+
| PovertyWatch   [Cakupan: Kota Medan]             [Pencarian Berita...]  [Login Admin] |
+---------------------------------------------------------------------------------------+
| [Info Banner: Menampilkan data pemantauan dari portal berita publik, bukan data resmi BPS] |
|                                                                                       |
| +------------------+ +------------------+ +------------------+ +--------------------+ |
| | TOTAL PEMBERITAAN| | 24 JAM TERAKHIR  | | SUMBER AKTIF     | | STATUS SCRAPER     | |
| | 1,428 Berita     | | 34 Berita Baru   | | 8 Portal Media   | | [● Normal (06:00)] | |
| | +12% bln lalu    | | Medan & Sumut    | | RSS & HTML       | | Next: Besok 06:00  | |
| +------------------+ +------------------+ +------------------+ +--------------------+ |
|                                                                                       |
| +-----------------------------------------------+ +---------------------------------+ |
| | TREN LIPUTAN MEDIA (30 HARI TERAKHIR)         | | DISTRIBUSI KATEGORI FENOMENA    | |
| | [Area / Line Chart: Frekuensi Berita per Hari]| | [Donut / Horizontal Bar Chart]  | |
| |                                               | | • Kemiskinan Ekstrem      (32%) | |
| |                                               | | • Rumah Tidak Layak Huni  (24%) | |
| |                                               | | • Stunting & Gizi Buruk   (18%) | |
| |                                               | | • Bansos & Bantuan Sosial (14%) | |
| |                                               | | • Pengangguran & PHK      (12%) | |
| +-----------------------------------------------+ +---------------------------------+ |
|                                                                                       |
| +-----------------------------------------------------------------------------------+ |
| | BERITA TERBARU DI KOTA MEDAN                          [Lihat Semua di Explorer ->]| |
| |                                                                                   | |
| | • [Waspada] Puluhan Warga Medan Belawan Terima Bantuan Pangan       [10 Menit lalu] | |
| |   Kategori: [Bansos] [Medan Belawan]  | Provenance: waspada.id                    | |
| |                                                                                   | |
| | • [Tribun Medan] Pemko Medan Bedah 15 Rumah Tidak Layak Huni        [2 Jam lalu]    | |
| |   Kategori: [RTLH] [Medan Sunggal]    | Provenance: medan.tribunnews.com          | |
| +-----------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------+
```

### 6.2 News Explorer (`/news`)

Tujuan: Meneliti, mencari, dan menelusuri artikel berita dengan kontrol granular.

```
+---------------------------------------------------------------------------------------+
| News Explorer - Penelusuran Berita Terstruktur                                        |
+---------------------------------------------------------------------------------------+
| [ Input Cari: "bansos belawan..." ] [Kategori ▼] [Sumber ▼] [Kecamatan ▼] [Periode ▼] |
| [ Export CSV ]                                                    [142 Hasil Ditemukan] |
+---------------------------------------------------------------------------------------+
| +-----------------------------------------------------------------------------------+ |
| | TABEL DAFTAR BERITA (Desktop Table / Mobile Card Layout)                          | |
| +-----------------------------------------------------------------------------------+ |
| | TANGGAL    | JUDUL BERITA                   | KATEGORI       | LOKASI      | SUMBER |
| |------------|--------------------------------|----------------|-------------|--------|
| | 03/11/2026 | Penanganan Stunting Terpadu... | [Stunting]     | Medan Deli  | Waspada|
| | 02/11/2026 | Warga Medan Amplas Keluhkan... | [Bansos]       | Medan Amplas| SumutPos|
| | 01/11/2026 | Permukiman Pinggir Rel KA...   | [Kumuh]        | Medan Timur | Antara |
| +-----------------------------------------------------------------------------------+ |
| [ Halaman: < 1  2  3  4  5 > ]                                        [Tampilkan: 20] |
+---------------------------------------------------------------------------------------+
```

### 6.3 News Detail Modal / Page (`/news/[id]`)

Tujuan: Menampilkan metadata artikel, ringkasan kontekstual, dan tautan provenance.

```
+---------------------------------------------------------------------------------------+
| [<- Kembali ke News Explorer]                                                         |
|                                                                                       |
| Penanganan Stunting Terpadu di Kawasan Pesisir Medan Belawan                           |
| Diterbitkan: 03 November 2026, 08:30 WIB  •  Penulis: Redaksi Medan                  |
| Portal Sumber: Waspada Online (RSS Ingestion)                                         |
|                                                                                       |
| [Badge: Stunting & Gizi Buruk]  [Badge: Medan Belawan]  [Badge: Relevansi: Tinggi]     |
|                                                                                       |
| +-----------------------------------------------------------------------------------+ |
| | RINGKASAN KONTEKSTUAL (Lead / Summary)                                            | |
| | Tim gabungan Dinas Kesehatan Kota Medan menggelar posko pemeriksaan terpadu untuk | |
| | mendeteksi balita berisiko stunting di 6 kelurahan wilayah Belawan...             | |
| +-----------------------------------------------------------------------------------+ |
|                                                                                       |
| INFORMASI PROVENANCE & TAUTAN ASLI:                                                   |
| URL Asli: https://waspada.co.id/2026/11/penanganan-stunting-medan-belawan             |
| URL Canonical: https://waspada.co.id/penanganan-stunting-medan-belawan                |
| Ingestion Job: #job-98234 (03 Nov 2026 09:00:12 WIB)                                 |
|                                                                                       |
| [ Buka Berita Lengkap di Situs Asli (waspada.co.id) -> ]                              |
| Catatan: PovertyWatch menghormati hak cipta media dan hanya menyimpan cuplikan data.  |
+---------------------------------------------------------------------------------------+
```

### 6.4 Sources Management (`/sources` — Operator)

```
+---------------------------------------------------------------------------------------+
| Manajemen Sumber Berita (Portal Media)                           [+ Tambah Sumber]    |
+---------------------------------------------------------------------------------------+
| [Total: 8 Sumber] [Aktif: 7] [Perlu Evaluasi: 1]                                      |
+---------------------------------------------------------------------------------------+
| NAMA SUMBER   | TIPE | FREKUENSI | TERAKHIR DISCRAPE    | STATUS    | AKSI            |
|---------------|------|-----------|----------------------|-----------|-----------------|
| Waspada RSS   | RSS  | Harian    | 03/11 06:00 (14 baru)| [● Aktif] | [Edit] [Scrape] |
| Tribun Medan  | HTML | Harian    | 03/11 06:05 (22 baru)| [● Aktif] | [Edit] [Scrape] |
| Antara Sumut  | RSS  | Harian    | 03/11 06:10 (8 baru) | [● Aktif] | [Edit] [Scrape] |
| Media X Local | HTML | Harian    | 02/11 06:00 (0 baru) | [▲ Cek]   | [Edit] [Test]   |
+---------------------------------------------------------------------------------------+
```

### 6.5 Scraping Monitor (`/scraping` — Operator)

```
+---------------------------------------------------------------------------------------+
| Scraping Monitor & Background Worker Control                 [▶ Jalankan Scrape Batch]|
+---------------------------------------------------------------------------------------+
| STATUS PEKERJA LATAR BELAKANG:                                                        |
| [● WORKER STANDBY]  Scheduler: 06:00 WIB Harian  •  Last Job: 03/11 06:12 WIB         |
|                                                                                       |
| +-----------------------------------------------------------------------------------+ |
| | RIWAYAT EKSEKUSI TERAKHIR                                                         | |
| | ID JOB     | PICU     | WAKTU EKSEKUSI | TOTAL DITEMUKAN | BARU | DUPLIKAT | STATUS  | |
| |------------|----------|----------------|-----------------|------|----------|---------| |
| | #job-104   | SCHEDULE | 03/11 06:00    | 84 artikel      | 42   | 42       | SUCCESS | |
| | #job-103   | MANUAL   | 02/11 14:20    | 12 artikel      | 4    | 8        | SUCCESS | |
| | #job-102   | SCHEDULE | 02/11 06:00    | 76 artikel      | 38   | 38       | SUCCESS | |
| +-----------------------------------------------------------------------------------+ |
| [Lihat Detail Log Lengkap ->]                                                         |
+---------------------------------------------------------------------------------------+
```

---

## 7. Reusable Component Specifications

Setiap komponen dirancang dengan kontrak props yang ketat, memanfaatkan primitives dari **shadcn/ui** dan **Lucide Icons**:

### 7.1 StatCard
- **Props:**
  ```typescript
  interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
      value: number;
      isPositive: boolean;
      label: string;
    };
    icon: React.ComponentType<{ className?: string }>;
    variant?: "default" | "success" | "warning" | "danger";
  }
  ```
- **Visual:** Kartu putih dengan border slate-200, icon di pojok kanan atas berbingkai warna muted, angka besar (text-3xl font-bold), deskripsi di bagian bawah.

### 7.2 NewsCard (Mobile & Compact View)
- **Props:**
  ```typescript
  interface NewsCardProps {
    news: {
      id: string;
      title: string;
      description?: string;
      sourceName: string;
      categoryName?: string;
      locationName?: string;
      publishedAt?: string | Date;
      url: string;
    };
    onSelect?: (id: string) => void;
  }
  ```

### 7.3 CategoryBadge & StatusBadge
- **CategoryBadge:** Pill badge dengan warna semantik sesuai taksonomi kemiskinan (lihat Bagian 2.2).
- **StatusBadge:** Status eksekusi job (`COMPLETED` = hijau, `RUNNING` = kuning/amber berkedip, `FAILED` = merah, `PENDING` = slate netral).

### 7.4 DateRangePicker
- Komponen popover kalender interaktif untuk memilih rentang tanggal fleksibel (7 hari terakhir, 30 hari terakhir, bulan ini, atau custom range).

---

## 8. Interaction States & System Feedback

Aplikasi wajib menangani 6 status interaksi pada setiap tampilan data:

### 8.1 Loading State (Skeleton Loaders)
- Menghindari spinner tunggal layar penuh yang membosankan.
- Menggunakan shimmer skeleton (`src/components/ui/skeleton.tsx`) yang meniru bentuk baris tabel, kartu metrik, dan blok grafik saat data sedang di-fetch.

### 8.2 Empty State
- Muncul ketika tidak ada data (misal pencarian kata kunci nihil atau filter terlalu sempit).
- **Elemen:** Ilustrasi/Icon Lucide netral (`FileQuestion` atau `SearchX`), judul informatif ("Tidak Ada Berita Ditemukan"), teks panduan ("Coba ubah kata kunci atau longgarkan filter tanggal"), serta tombol aksi ("Reset Filter").

### 8.3 Error State
- Muncul jika fetch API atau worker mengalami kegagalan.
- **Elemen:** Icon `AlertTriangle` warna merah lembut, pesan bersahabat ("Gagal Memuat Data Statistik"), dan tombol aksi `Coba Lagi (Retry)`.

### 8.4 Success Feedback
- Notifikasi toast mengambang di pojok kanan atas (menggunakan Sonner / Toast shadcn) untuk aksi sukses: *"Sumber Berita Berhasil Ditambahkan"*, *"Scraping Manual Telah Dicuilkan ke Antrean"*, *"File CSV Berhasil Diunduh"*.

### 8.5 ConfirmDialog (Destructive Actions)
- Modal dialog konfirmasi sebelum tindakan berisiko:
  - Hapus sumber berita.
  - Reset database / pemicuan scrape massal.
  - Memerlukan konfirmasi klik eksplisit dengan tombol merah bertuliskan aksi spesifik.

---

## 9. Responsive Breakpoints & Device Adaptation

| Breakpoint | Target Layar | Layout Adaptations |
|---|---|---|
| **`< 768px` (Mobile)** | iPhone, Android Phone | • Sidebar disembunyikan; diakses via menu drawer sheet.<br>• StatCards bertumpuk vertikal 1 kolom (`grid-cols-1`).<br>• News Explorer beralih otomatis dari tabel horizontal menjadi format kartu ringkas (NewsCard).<br>• Filter bar menjadi tombol "Filter" yang memunculkan bottom drawer modal. |
| **`768px – 1023px` (Tablet)** | iPad, Android Tablets | • Sidebar dapat disusutkan menjadi icon-only (72px).<br>• StatCards tersusun 2 kolom (`grid-cols-2`).<br>• Tabel berita menampilkan kolom esensial (Judul, Kategori, Tanggal). |
| **`≥ 1024px` (Desktop)** | Laptop, Monitor PC | • Full sidebar terbuka permanen (256px).<br>• StatCards tersusun 4 kolom (`grid-cols-4`).<br>• Tabel berita penuh dengan semua kolom metrik dan aksi cepat. |

---

## 10. Accessibility & Usability (WCAG 2.1 AA)

1. **Rasio Kontras Warna:** Seluruh teks memiliki rasio kontras minimal `4.5:1` terhadap background-nya (`#0F172A` dan `#475569` pada `#F8FAFC`).
2. **Navigasi Keyboard:** Semua interaksi (dropdown filter, baris tabel, tombol aksi, modal) dapat diakses penuh menggunakan tombol `Tab`, `Enter`, dan `Escape`.
3. **Screen Reader Semantic:** Menggunakan tag semantik HTML5 (`<main>`, `<nav>`, `<aside>`, `<header>`, `<table>`) serta atribut `aria-label` yang jelas pada tombol ikon (seperti tombol edit, delete, dan expand).
4. **Motion Preference:** Menghormati pengaturan `prefers-reduced-motion` untuk pengguna yang sensitif terhadap animasi.

---

## 11. Kesimpulan Panduan
Panduan UI/UX ini mengikat seluruh pengembangan visual pada:
- **Phase 4:** Pembangunan Application Shell, Sidebar, Header, dan Global Layout.
- **Phase 5:** Pembangunan Halaman Inti (Dashboard, News Explorer, Detail, Sources, Monitor).
- **Phase 8:** Polishing estetika, empty states, dan responsivitas mobile.
