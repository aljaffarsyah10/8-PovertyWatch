import { URL } from "url";

const FORBIDDEN_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // Cloud instance metadata (AWS, GCP, Azure, DigitalOcean)
  "metadata.google.internal",
  "instance-data",
]);

const FORBIDDEN_TLDS = [".local", ".localhost", ".internal", ".lan", ".home", ".corp"];

const RESTRICTED_PORTS = new Set([
  "22",    // SSH
  "25",    // SMTP
  "110",   // POP3
  "143",   // IMAP
  "3306",  // MySQL
  "5432",  // PostgreSQL
  "6379",  // Redis
  "9200",  // Elasticsearch
  "27017", // MongoDB
  "11211", // Memcached
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

    // 1. Validasi Protocol: Hanya HTTP dan HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        error: `Protokol ${parsed.protocol} tidak diizinkan. Hanya HTTP/HTTPS yang didukung.`,
      };
    }

    // 2. Validasi Port
    if (parsed.port && RESTRICTED_PORTS.has(parsed.port)) {
      return {
        valid: false,
        error: `Port ${parsed.port} adalah port layanan internal terbatas yang diblokir.`,
      };
    }

    // Normalisasi hostname
    const cleanHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");

    // 3. Blokir Blacklisted Hostnames
    if (FORBIDDEN_HOSTNAMES.has(cleanHost)) {
      return {
        valid: false,
        error: `Akses ke host lokal/metadata (${cleanHost}) diblokir demi keamanan.`,
      };
    }

    // 4. Blokir Internal / Local TLDs
    for (const tld of FORBIDDEN_TLDS) {
      if (cleanHost.endsWith(tld)) {
        return {
          valid: false,
          error: `Akses ke domain lokal (*${tld}) diblokir demi keamanan.`,
        };
      }
    }

    // 5. Blokir Seluruh Loopback IPv4 (127.0.0.0/8) & 0.0.0.0/8
    if (/^127\./.test(cleanHost) || cleanHost === "127.1" || /^0\./.test(cleanHost) || cleanHost === "0") {
      return {
        valid: false,
        error: "Akses ke alamat loopback lokal diblokir.",
      };
    }

    // 6. Blokir Private IP Ranges (RFC 1918)
    // 10.0.0.0/8
    if (/^10\./.test(cleanHost)) {
      return { valid: false, error: "Akses ke IP private 10.x.x.x diblokir." };
    }
    // 172.16.0.0 - 172.31.255.255
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanHost)) {
      return {
        valid: false,
        error: "Akses ke IP private 172.16-31.x.x diblokir.",
      };
    }
    // 192.168.0.0/16
    if (/^192\.168\./.test(cleanHost)) {
      return {
        valid: false,
        error: "Akses ke IP private 192.168.x.x diblokir.",
      };
    }
    // Link-local 169.254.0.0/16
    if (/^169\.254\./.test(cleanHost)) {
      return { valid: false, error: "Akses ke IP link-local diblokir." };
    }

    // 7. Blokir IPv6 Loopback dan Private/Unique Local
    if (
      cleanHost === "::1" ||
      cleanHost.startsWith("fe80:") ||
      cleanHost.startsWith("fc00:") ||
      cleanHost.startsWith("fd00:") ||
      cleanHost.startsWith("::ffff:127.") ||
      cleanHost.startsWith("::ffff:10.") ||
      cleanHost.startsWith("::ffff:192.168.")
    ) {
      return {
        valid: false,
        error: "Akses ke IPv6 lokal / private diblokir.",
      };
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
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new Error(`Ukuran respons melebihi batas (${contentLength} bytes)`);
    }

    return response;
  } finally {
    clearTimeout(timer);
  }
}
