export const MEDAN_DISTRICTS = [
  "Medan Belawan",
  "Medan Deli",
  "Medan Labuhan",
  "Medan Marelan",
  "Medan Kota",
  "Medan Timur",
  "Medan Barat",
  "Medan Sunggal",
  "Medan Helvetia",
  "Medan Denai",
  "Medan Amplas",
  "Medan Area",
  "Medan Johor",
  "Medan Selayang",
  "Medan Tuntungan",
  "Medan Tembung",
  "Medan Perjuangan",
  "Medan Petisah",
  "Medan Baru",
  "Medan Maimun",
  "Medan Polonia",
];

export interface KelurahanMapping {
  name: string;
  district: string;
}

export const KNOWN_KELURAHAN: KelurahanMapping[] = [
  { name: "Bagan Deli", district: "Medan Belawan" },
  { name: "Belawan I", district: "Medan Belawan" },
  { name: "Belawan II", district: "Medan Belawan" },
  { name: "Belawan Bahari", district: "Medan Belawan" },
  { name: "Sicanang", district: "Medan Belawan" },
  { name: "Titipapan", district: "Medan Deli" },
  { name: "Mabar", district: "Medan Deli" },
  { name: "Tanjung Mulia", district: "Medan Deli" },
  { name: "Martubung", district: "Medan Labuhan" },
  { name: "Pekan Labuhan", district: "Medan Labuhan" },
  { name: "Tangkuha", district: "Medan Labuhan" },
  { name: "Terjun", district: "Medan Marelan" },
  { name: "Rengas Pulau", district: "Medan Marelan" },
  { name: "Kesawan", district: "Medan Barat" },
  { name: "Pulo Brayan", district: "Medan Barat" },
  { name: "Petisah Tengah", district: "Medan Petisah" },
  { name: "Sei Putih", district: "Medan Petisah" },
  { name: "Babura", district: "Medan Baru" },
  { name: "Padang Bulan", district: "Medan Baru" },
  { name: "Kampung Baru", district: "Medan Maimun" },
  { name: "Titi Kuning", district: "Medan Johor" },
  { name: "Tanjung Gusta", district: "Medan Helvetia" },
  { name: "Sunggal", district: "Medan Sunggal" },
  { name: "Timbang Deli", district: "Medan Amplas" },
];

export interface LocationExtractionResult {
  locationName: string;
  locationLevel: "KELURAHAN" | "KECAMATAN" | "KOTA";
  districtName?: string;
}

/**
 * Mendeteksi nama kelurahan, kecamatan, atau kota di wilayah Kota Medan dari naskah berita.
 * Sesuai prinsip: Jangan mengarang lokasi jika tidak ditemukan.
 */
export function extractMedanLocation(
  title: string,
  contentOrDesc: string
): LocationExtractionResult {
  const combined = ` ${title} ${contentOrDesc} `.toLowerCase();

  // 1. Prioritaskan pencocokan nama lengkap kecamatan (misal: "Medan Sunggal", "Medan Belawan")
  for (const district of MEDAN_DISTRICTS) {
    const fullName = district.toLowerCase();
    const fullPattern = new RegExp(`\\b${fullName}\\b`, "i");
    if (fullPattern.test(combined)) {
      return {
        locationName: district,
        locationLevel: "KECAMATAN",
        districtName: district,
      };
    }
  }

  // 2. Pencarian kelurahan spesifik (misal: "Sicanang", "Bagan Deli", "Kesawan")
  for (const kel of KNOWN_KELURAHAN) {
    const kelPattern = new RegExp(`\\b${kel.name.toLowerCase()}\\b`, "i");
    if (kelPattern.test(combined)) {
      return {
        locationName: `Kel. ${kel.name} (${kel.district})`,
        locationLevel: "KELURAHAN",
        districtName: kel.district,
      };
    }
  }

  // 3. Pencarian nama pendek kecamatan (misal: "Belawan", "Marelan", "Helvetia")
  for (const district of MEDAN_DISTRICTS) {
    const shortName = district.replace(/^Medan\s+/i, "").toLowerCase();
    const shortPattern = new RegExp(`\\b${shortName}\\b`, "i");

    if (shortName.length > 4 && shortPattern.test(combined)) {
      return {
        locationName: district,
        locationLevel: "KECAMATAN",
        districtName: district,
      };
    }
  }

  // 4. Fallback jika secara umum menyebut Kota Medan atau berita lokal
  return {
    locationName: "Kota Medan",
    locationLevel: "KOTA",
  };
}
