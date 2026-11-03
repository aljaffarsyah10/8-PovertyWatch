/**
 * [MOCK DATA] Daftar Berita Terstruktur (Kota Medan)
 * Hanya digunakan untuk kebutuhan rendering frontend sebelum integrasi database (Phase 6).
 */

export interface MockNewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  title: string;
  url: string;
  normalizedUrl: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  locationName: string; // e.g., Medan Belawan, Medan Amplas
  locationLevel: string; // KECAMATAN / KOTA
  relevanceScore: number;
}

export const MOCK_NEWS: MockNewsItem[] = [
  {
    id: "news-101",
    sourceId: "src-1",
    sourceName: "Waspada Online",
    categoryId: "cat-3",
    categoryName: "Stunting & Gizi Buruk",
    categorySlug: "stunting-gizi-buruk",
    title: "Penanganan Stunting Terpadu Digencarkan di Wilayah Pesisir Belawan",
    url: "https://waspada.id/medan/penanganan-stunting-belawan-2026?utm_source=rss",
    normalizedUrl: "https://waspada.id/medan/penanganan-stunting-belawan-2026",
    description: "Dinas Kesehatan Kota Medan mendirikan posko layanan gizi darurat dan penimbangan balita rutin menyusul tingginya temuan risiko stunting di perkampungan nelayan Medan Belawan.",
    content: "Upaya pencegahan dan penanganan stunting di wilayah Medan bagian utara terus diintensifkan. Sebanyak 120 balita di Kelurahan Bagan Deli mendapatkan pendampingan makanan bergizi dan susu formula khusus dari tim terpadu puskesmas setempat...",
    author: "Tim Redaksi Waspada",
    publishedAt: "2026-11-03 08:30 WIB",
    locationName: "Medan Belawan",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.95,
  },
  {
    id: "news-102",
    sourceId: "src-2",
    sourceName: "Tribun Medan",
    categoryId: "cat-2",
    categoryName: "Rumah Tidak Layak Huni (RTLH)",
    categorySlug: "rtlh-kumuh",
    title: "Pemko Medan Bedah 25 Rumah Tidak Layak Huni di Bantaran Sungai Deli",
    url: "https://medan.tribunnews.com/2026/11/02/pemko-bedah-rtlh-sungai-deli?ref=feed",
    normalizedUrl: "https://medan.tribunnews.com/2026/11/02/pemko-bedah-rtlh-sungai-deli",
    description: "Program perbaikan hunian warga berpenghasilan rendah difokuskan pada rumah berbahan papan lapuk di kawasan Medan Maimun dan Medan Labuhan yang rawan tergenang luapan air sungai.",
    content: "Program bedah rumah swadaya kembali menyasar kawasan pemukiman padat. Bantuan stimulan senilai Rp 20 juta per kepala keluarga disalurkan untuk perbaikan atap, lantai semen, dan fasilitas MCK komunal...",
    author: "Andi Syahputra",
    publishedAt: "2026-11-02 16:15 WIB",
    locationName: "Medan Maimun",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.92,
  },
  {
    id: "news-103",
    sourceId: "src-3",
    sourceName: "Sumut Pos",
    categoryId: "cat-7",
    categoryName: "Permasalahan Bantuan Sosial (Bansos)",
    categorySlug: "bansos-bantuan-sosial",
    title: "Warga Medan Amplas Laporkan Puluhan Keluarga Kurang Mampu Luput dari Data Bansos",
    url: "https://sumutpos.jawapos.com/medan/02/11/2026/warga-amplas-keluhkan-bansos?utm_medium=share",
    normalizedUrl: "https://sumutpos.jawapos.com/medan/02/11/2026/warga-amplas-keluhkan-bansos",
    description: "Puluhan warga buruh harian dan lansia sebatang kara mengadukan verifikasi DTKS yang dinilai belum mencerminkan kondisi riil di tingkat lingkungan.",
    content: "Aparat kelurahan bersama pendamping sosial PKH diminta turun langsung melakukan sinkronisasi data penerima manfaat. Sejumlah warga yang berhak mengaku belum pernah menerima bantuan beras Cadangan Pangan Pemerintah selama tiga bulan berturut-turut...",
    author: "Budi Siregar",
    publishedAt: "2026-11-02 11:45 WIB",
    locationName: "Medan Amplas",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.88,
  },
  {
    id: "news-104",
    sourceId: "src-4",
    sourceName: "Antara News Sumut",
    categoryId: "cat-6",
    categoryName: "Kerawanan Pangan",
    categorySlug: "kerawanan-pangan",
    title: "Pasar Murah Beras SPHP Diserbu Ribuan Buruh di Kawasan Industri Medan",
    url: "https://sumut.antaranews.com/berita/pasar-murah-kim-medan-2026",
    normalizedUrl: "https://sumut.antaranews.com/berita/pasar-murah-kim-medan-2026",
    description: "Operasi pasar murah bahan pangan pokok digelar guna meredam dampak kenaikan harga beras terhadap pengeluaran harian keluarga pra-sejahtera di Medan Deli.",
    content: "Perum Bulog Kanwil Sumatera Utara menyalurkan 10 ton beras program stabilisasi pasokan dan harga pangan (SPHP) langsung ke titik pemukiman padat pekerja pabrik di Medan Deli. Antrean warga berlangsung sejak pagi demi mendapatkan beras seharga Rp 11.500 per kilogram...",
    author: "Fauzi Hasibuan",
    publishedAt: "2026-11-01 14:20 WIB",
    locationName: "Medan Deli",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.89,
  },
  {
    id: "news-105",
    sourceId: "src-1",
    sourceName: "Waspada Online",
    categoryId: "cat-8",
    categoryName: "Dampak Bencana Terhadap Kelompok Rentan",
    categorySlug: "dampak-bencana-rentan",
    title: "Banjir Rob Pasang Air Laut Rendam Ribuan Rumah Nelayan di Medan Belawan",
    url: "https://waspada.id/medan/banjir-rob-belawan-november-2026",
    normalizedUrl: "https://waspada.id/medan/banjir-rob-belawan-november-2026",
    description: "Fenomena pasang air laut setinggi 50 cm melumpuhkan aktivitas ekonomi nelayan kecil dan merendam fasilitas umum sekolah dasar serta posyandu di pesisir.",
    content: "Banjir rob bulanan kembali melanda enam kelurahan di Kecamatan Medan Belawan. Genangan air asin yang masuk ke dalam rumah memaksa warga mengangkat perabotan sederhana dan menghentikan kegiatan melaut sementara waktu...",
    author: "Zulham Efendi",
    publishedAt: "2026-11-01 09:10 WIB",
    locationName: "Medan Belawan",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.91,
  },
  {
    id: "news-106",
    sourceId: "src-5",
    sourceName: "Harian Analisa",
    categoryId: "cat-4",
    categoryName: "Anak Putus Sekolah",
    categorySlug: "anak-putus-sekolah",
    title: "Komunitas Relawan Dampingi 40 Anak Putus Sekolah di Pinggiran Rel Medan Timur",
    url: "https://analisadaily.com/kota/2026/10/31/anak-putus-sekolah-medan-timur/",
    normalizedUrl: "https://analisadaily.com/kota/2026/10/31/anak-putus-sekolah-medan-timur",
    description: "Program kejar paket dan kursus keterampilan non-formal diberikan bagi anak-anak keluarga pemulung dan juru parkir di kawasan lintasan kereta api.",
    content: "Yayasan pendidikan sosial bersama para mahasiswa relawan mendirikan sanggar belajar terbuka di Medan Timur. Program ini memfasilitasi anak-anak yang putus sekolah sejak masa pandemi agar dapat kembali memperoleh ijazah kesetaraan Paket A dan Paket B...",
    author: "Sri Wahyuni",
    publishedAt: "2026-10-31 17:30 WIB",
    locationName: "Medan Timur",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.86,
  },
  {
    id: "news-107",
    sourceId: "src-2",
    sourceName: "Tribun Medan",
    categoryId: "cat-5",
    categoryName: "Pengangguran & PHK",
    categorySlug: "pengangguran-phk",
    title: "Dua Pabrik Garmen Tutup, Ratusan Pekerja Wanita di Medan Sunggal Terdampak PHK",
    url: "https://medan.tribunnews.com/2026/10/30/phk-pabrik-garmen-medan-sunggal",
    normalizedUrl: "https://medan.tribunnews.com/2026/10/30/phk-pabrik-garmen-medan-sunggal",
    description: "Penurunan pesanan ekspor menyebabkan penghentian operasional pabrik tekstil lokal, memicu peningkatan beban ekonomi bagi keluarga buruh.",
    content: "Dinas Ketenagakerjaan Kota Medan memfasilitasi proses mediasi pemenuhan hak pesangon dan mengarahkan eks buruh untuk mengikuti pelatihan wirausaha kuliner serta tata boga...",
    author: "Rahmat Hidayat",
    publishedAt: "2026-10-30 13:00 WIB",
    locationName: "Medan Sunggal",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.87,
  },
  {
    id: "news-108",
    sourceId: "src-1",
    sourceName: "Waspada Online",
    categoryId: "cat-1",
    categoryName: "Kemiskinan Ekstrem",
    categorySlug: "kemiskinan-ekstrem",
    title: "Potret Nenek Sebatang Kara di Medan Tuntungan Bertahan Hidup dari Bantuan Tetangga",
    url: "https://waspada.id/sosial/potret-lansia-medan-tuntungan-2026",
    normalizedUrl: "https://waspada.id/sosial/potret-lansia-medan-tuntungan-2026",
    description: "Kisah humanis seorang lansia tunawisma yang menempati gubuk kayu tanpa penerangan listrik di pinggiran perkebunan Medan Tuntungan menjadi sorotan warga.",
    content: "Setelah ramai diberitakan di media sosial dan portal lokal, tim Dinas Sosial Kota Medan turun tangan untuk mengevakuasi sang nenek ke panti jompo binaan pemerintah serta memberikan kartu jaminan kesehatan...",
    author: "Dedi Irawan",
    publishedAt: "2026-10-29 10:20 WIB",
    locationName: "Medan Tuntungan",
    locationLevel: "KECAMATAN",
    relevanceScore: 0.94,
  },
];
