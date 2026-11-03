import { URL } from "url";

const FORBIDDEN_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // Cloud instance metadata
  "metadata.google.internal",
]);

/**
 * Memvalidasi apakah URL aman untuk diambil (mencegah SSRF terhadap jaringan internal).
 */
export function validateUrlForScraping(rawUrl: string): {
  valid: boolean;
  error?: string;
  url?: URL;
} {
  try {
    const parsed = new URL(rawUrl);

    // 1. Validasi Protocol
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        error: `Protokol ${parsed.protocol} tidak diizinkan. Hanya HTTP/HTTPS yang didukung.`,
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Blokir Blacklisted Hostnames
    if (FORBIDDEN_HOSTNAMES.has(hostname)) {
      return {
        valid: false,
        error: `Akses ke host lokal/metadata (${hostname}) diblokir demi keamanan.`,
      };
    }

    // 3. Blokir Private IP Ranges (RFC 1918)
    // 10.0.0.0/8
    if (/^10\./.test(hostname)) {
      return { valid: false, error: "Akses ke IP private 10.x.x.x diblokir." };
    }
    // 172.16.0.0 - 172.31.255.255
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
      return {
        valid: false,
        error: "Akses ke IP private 172.16-31.x.x diblokir.",
      };
    }
    // 192.168.0.0/16
    if (/^192\.168\./.test(hostname)) {
      return {
        valid: false,
        error: "Akses ke IP private 192.168.x.x diblokir.",
      };
    }
    // Link-local 169.254.0.0/16
    if (/^169\.254\./.test(hostname)) {
      return { valid: false, error: "Akses ke IP link-local diblokir." };
    }

    return { valid: true, url: parsed };
  } catch (err: unknown) {
    return {
      valid: false,
      error: `Format URL tidak valid: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Fetch wrapper aman dengan timeout dan batas payload.
 */
export async function secureFetch(
  url: string,
  options: {
    timeoutMs?: number;
    userAgent?: string;
    maxBytes?: number;
  } = {}
): Promise<Response> {
  const { timeoutMs = 10000, userAgent, maxBytes = 5 * 1024 * 1024 } = options;

  const check = validateUrlForScraping(url);
  if (!check.valid || !check.url) {
    throw new Error(`SSRF Blocked: ${check.error}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const defaultUserAgent =
    process.env.SCRAPER_USER_AGENT ||
    "PovertyWatch-Bot/1.0 (+https://povertywatch.id/about-bot)";

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent || defaultUserAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new Error(
        `Payload size (${contentLength} bytes) melebihi batas maksimum ${maxBytes} bytes.`
      );
    }

    return response;
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Request timeout setelah ${timeoutMs}ms saat menghubungi ${url}`
      );
    }
    throw err;
  }
}
