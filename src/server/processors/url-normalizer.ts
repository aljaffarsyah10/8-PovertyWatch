import { URL } from "url";

// Parameter pelacak umum yang aman untuk dibuang tanpa merusak routing artikel
const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "source",
  "ocid",
  "_ga",
  "spm",
]);

/**
 * Menormalisasi URL berita menjadi bentuk kanonikal unik:
 * - Menghilangkan parameter pelacak analitik
 * - Mempertahankan parameter artikel penting (misal ?id= atau ?p=)
 * - Lowercase domain
 * - Menghapus fragment (#hash)
 * - Menghapus trailing slash pada pathname
 */
export function normalizeNewsUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());

    // Lowercase hostname
    url.hostname = url.hostname.toLowerCase();

    // Hapus fragment
    url.hash = "";

    // Hapus parameter pelacak
    const paramsToDelete: string[] = [];
    url.searchParams.forEach((_, key) => {
      const lower = key.toLowerCase();
      if (TRACKING_PARAMS.has(lower) || lower.startsWith("utm_")) {
        paramsToDelete.push(key);
      }
    });
    paramsToDelete.forEach((key) => url.searchParams.delete(key));

    // Sort query parameters agar konsisten
    url.searchParams.sort();

    // Normalisasi trailing slash pada pathname
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.toString();
  } catch {
    // Jika format URL cacat, kembalikan teks aslinya setelah di-trim
    return rawUrl.trim();
  }
}

