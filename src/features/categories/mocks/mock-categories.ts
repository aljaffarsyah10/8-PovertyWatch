/**
 * [MOCK DATA] Kategori Kemiskinan & Kata Kunci (Kota Medan)
 * Hanya digunakan untuk kebutuhan rendering frontend sebelum integrasi database (Phase 6).
 */

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  keywords: string[];
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat-1",
    name: "Kemiskinan Ekstrem",
    slug: "kemiskinan-ekstrem",
    description: "Kondisi ketidakmampuan memenuhi kebutuhan dasar makanan, air bersih, dan sanitasi.",
    count: 320,
    keywords: ["kemiskinan ekstrem", "keluarga pra-sejahtera", "kelaparan", "gelandangan", "pengemis"],
  },
  {
    id: "cat-2",
    name: "Rumah Tidak Layak Huni (RTLH) & Permukiman Kumuh",
    slug: "rtlh-kumuh",
    description: "Kondisi hunian padat, sanitasi buruk, pinggiran rel, bantaran sungai, dan pesisir.",
    count: 245,
    keywords: ["bedah rumah", "rtlh", "permukiman kumuh", "bantaran sungai deli", "pesisir belawan", "gubuk"],
  },
  {
    id: "cat-3",
    name: "Stunting & Gizi Buruk",
    slug: "stunting-gizi-buruk",
    description: "Gangguan pertumbuhan anak balita akibat kekurangan gizi kronis di wilayah rentan.",
    count: 198,
    keywords: ["stunting", "gizi buruk", "posyandu", "balita kurang gizi", "penimbangan balita"],
  },
  {
    id: "cat-4",
    name: "Anak Putus Sekolah & Hak Pendidikan",
    slug: "anak-putus-sekolah",
    description: "Anak usia sekolah yang terpaksa berhenti belajar karena kendala biaya atau bekerja.",
    count: 142,
    keywords: ["putus sekolah", "anak jalanan", "biaya sekolah", "seragam sekolah", "bantuan pendidikan"],
  },
  {
    id: "cat-5",
    name: "Pengangguran & PHK",
    slug: "pengangguran-phk",
    description: "Tingkat pengangguran terbuka, pemutusan hubungan kerja, dan pekerja informal.",
    count: 185,
    keywords: ["phk", "pengangguran", "pencari kerja", "buruh harian lepas", "pabrik tutup"],
  },
  {
    id: "cat-6",
    name: "Kerawanan Pangan",
    slug: "kerawanan-pangan",
    description: "Lonjakan harga pangan pokok yang membebani daya beli masyarakat berpendapatan rendah.",
    count: 164,
    keywords: ["beras mahal", "pasar murah", "antrean sembako", "bantuan pangan", "daya beli turun"],
  },
  {
    id: "cat-7",
    name: "Permasalahan Bantuan Sosial (Bansos)",
    slug: "bansos-bantuan-sosial",
    description: "Isu penyaluran PKH, BLT, bansos pangan tidak tepat sasaran atau data anomali.",
    count: 215,
    keywords: ["pkh", "blt", "bansos salah sasaran", "dtks", "pembagian beras", "kartu sembako"],
  },
  {
    id: "cat-8",
    name: "Dampak Bencana Terhadap Kelompok Rentan",
    slug: "dampak-bencana-rentan",
    description: "Banjir rob Belawan, banjir kiriman sungai Deli/Babura yang memiskinkan warga rentan.",
    count: 112,
    keywords: ["banjir rob", "sungai deli meluap", "pengungsi banjir", "kampung nelayan terendam"],
  },
];

