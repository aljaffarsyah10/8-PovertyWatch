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

export interface LocationExtractionResult {
  locationName: string;
  locationLevel: "KECAMATAN" | "KOTA";
}

/**
 * Mendeteksi nama kecamatan di Kota Medan dari naskah berita.
 */
export function extractMedanLocation(
  title: string,
  contentOrDesc: string
): LocationExtractionResult {
  const combined = `${title} ${contentOrDesc}`.toLowerCase();

  for (const district of MEDAN_DISTRICTS) {
    // Cocokkan nama lengkap kecamatan (misal: "medan belawan")
    // atau nama daerah spesifik (misal: "belawan", "sunggal", "amplas")
    const fullName = district.toLowerCase();
    const shortName = district.replace(/^Medan\s+/i, "").toLowerCase();

    if (
      combined.includes(fullName) ||
      (shortName.length > 4 && combined.includes(shortName))
    ) {
      return {
        locationName: district,
        locationLevel: "KECAMATAN",
      };
    }
  }

  return {
    locationName: "Kota Medan",
    locationLevel: "KOTA",
  };
}

