import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { validateUrlForScraping } from "../src/server/security/ssrf-guard";
import { sanitizeFormulaInjection } from "../src/server/security/sanitize-export";
import { cleanText } from "../src/server/processors/text-cleaner";
import { normalizeNewsUrl } from "../src/server/processors/url-normalizer";

async function runSecurityAndQATests() {
  console.log("\n=== POVERTYWATCH PHASE 9 SECURITY & QA AUDIT TEST SUITE ===");

  // -------------------------------------------------------------
  // [1] SSRF Guard Comprehensive Penetration Test
  // -------------------------------------------------------------
  console.log("\n[1] Pengujian Keamanan SSRF Guard:");
  const ssrfVectors = [
    { url: "http://localhost:3000", expected: false, label: "Localhost HTTP" },
    { url: "http://127.0.0.1:8080", expected: false, label: "IPv4 Loopback" },
    { url: "http://127.0.1.1", expected: false, label: "127.0.0.0/8 Subnet" },
    { url: "http://0.0.0.0:80", expected: false, label: "0.0.0.0 Host" },
    { url: "http://[::1]:3000", expected: false, label: "IPv6 Loopback" },
    { url: "http://169.254.169.254/latest/meta-data", expected: false, label: "Cloud Metadata AWS" },
    { url: "http://metadata.google.internal/computeMetadata/v1", expected: false, label: "GCP Metadata Host" },
    { url: "http://10.0.0.5/admin", expected: false, label: "Class A Private IP 10.x" },
    { url: "http://172.20.10.2/api", expected: false, label: "Class B Private IP 172.16-31" },
    { url: "http://192.168.1.254", expected: false, label: "Class C Private IP 192.168" },
    { url: "http://internal-server.local", expected: false, label: "mDNS .local TLD" },
    { url: "http://db.lan:5432", expected: false, label: "Restricted DB Port 5432" },
    { url: "ftp://files.example.com", expected: false, label: "Protokol Non-HTTP (FTP)" },
    { url: "file:///etc/passwd", expected: false, label: "Protokol Berkas (FILE)" },
    { url: "javascript:alert(1)", expected: false, label: "Protokol Pseudo (Javascript)" },
    { url: "https://waspada.id/feed", expected: true, label: "Domain Berita Publik Waspada.id" },
    { url: "https://sumut.antaranews.com/rss/terkini.xml", expected: true, label: "Domain Berita Publik Antara Sumut" },
  ];

  for (const vector of ssrfVectors) {
    const res = validateUrlForScraping(vector.url);
    assert.strictEqual(
      res.valid,
      vector.expected,
      `Vektor SSRF '${vector.label}' (${vector.url}) seharusnya valid=${vector.expected}, tetapi bernilai ${res.valid}`
    );
    console.log(`✅ PASSED: SSRF Guard: ${vector.label} -> ${res.valid ? "ALLOWED" : "BLOCKED"}`);
  }

  // -------------------------------------------------------------
  // [2] Formula Injection Protection (CSV / Excel)
  // -------------------------------------------------------------
  console.log("\n[2] Pengujian Sanitasi Formula Injection (CWE-1236):");
  const formulaVectors = [
    { input: "=cmd|' /C calc'!A0", expected: "'=cmd|' /C calc'!A0", label: "Formula Equals (=)" },
    { input: "+1+2", expected: "'+1+2", label: "Formula Plus (+)" },
    { input: "-5+10", expected: "'-5+10", label: "Formula Minus (-)" },
    { input: "@SUM(A1:A10)", expected: "'@SUM(A1:A10)", label: "Formula At (@)" },
    { input: "\tDDE_COMMAND", expected: "'\tDDE_COMMAND", label: "Formula Tab (\\t)" },
    { input: "Bantuan Pangan Non Tunai", expected: "Bantuan Pangan Non Tunai", label: "Teks Normal Aman" },
    { input: "Medan Belawan", expected: "Medan Belawan", label: "Nama Lokasi Normal" },
  ];

  for (const vector of formulaVectors) {
    const sanitized = sanitizeFormulaInjection(vector.input);
    assert.strictEqual(sanitized, vector.expected, `Sanitasi formula '${vector.label}' gagal`);
    console.log(`✅ PASSED: Formula Sanitizer: ${vector.label} -> "${sanitized}"`);
  }

  // -------------------------------------------------------------
  // [3] XSS & Script Tag Stripping
  // -------------------------------------------------------------
  console.log("\n[3] Pengujian Pembersihan XSS & Script Tag:");
  const xssVectors = [
    {
      input: "<script>alert(document.cookie);</script>Pemko Medan gelar pasar murah",
      expected: "Pemko Medan gelar pasar murah",
      label: "Inline <script> Tag Content Stripped",
    },
    {
      input: "<style>body{background:red;}</style>Warga terima bansos beras",
      expected: "Warga terima bansos beras",
      label: "Inline <style> Tag Content Stripped",
    },
    {
      input: "<img src=x onerror=alert(1)>Kondisi rumah warga di Belawan",
      expected: "Kondisi rumah warga di Belawan",
      label: "Event Handler Onerror Stripped",
    },
    {
      input: "Harga cabai &quot;meroket&quot; &amp; daya beli &lt;turun&gt;",
      expected: 'Harga cabai "meroket" & daya beli <turun>',
      label: "HTML Entities Decoded Safely",
    },
  ];

  for (const vector of xssVectors) {
    const cleaned = cleanText(vector.input);
    assert.strictEqual(cleaned, vector.expected, `Pembersihan XSS '${vector.label}' tidak sesuai`);
    console.log(`✅ PASSED: XSS Cleaner: ${vector.label} -> "${cleaned}"`);
  }

  // -------------------------------------------------------------
  // [4] URL Canonicalization & Tracking Stripping
  // -------------------------------------------------------------
  console.log("\n[4] Pengujian Normalisasi URL & Penghilangan Parameter Pelacak:");
  const urlVectors = [
    {
      input: "HTTPS://WASpada.ID/berita-medan/?utm_source=facebook&utm_medium=cpc&fbclid=abcdef#comments",
      expected: "https://waspada.id/berita-medan",
      label: "Uppercase Hostname, UTM Tracking, FBCLID & Hash Fragment",
    },
    {
      input: "https://waspada.id/medan/bedah-rumah/",
      expected: "https://waspada.id/medan/bedah-rumah",
      label: "Trailing Slash Removal",
    },
    {
      input: "https://waspada.id/artikel?id=123&utm_campaign=daily",
      expected: "https://waspada.id/artikel?id=123",
      label: "Preserve Functional ID Query Params while Stripping UTM",
    },
  ];

  for (const vector of urlVectors) {
    const norm = normalizeNewsUrl(vector.input);
    assert.strictEqual(norm, vector.expected, `Normalisasi '${vector.label}' gagal`);
    console.log(`✅ PASSED: URL Normalizer: ${vector.label} -> "${norm}"`);
  }

  // -------------------------------------------------------------
  // [5] Database Indexing & Schema Audit
  // -------------------------------------------------------------
  console.log("\n[5] Pengujian Audit Indeks Basis Data Prisma:");
  const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");

  const requiredIndexes = [
    "@@index([publishedAt(sort: Desc)])",
    "@@index([categoryId])",
    "@@index([sourceId])",
    "@@index([isRelevant])",
    "@@index([isActive])",
    "@@index([status, createdAt])",
    "@@index([jobId])",
  ];

  for (const idx of requiredIndexes) {
    assert.ok(
      schemaContent.includes(idx),
      `Skema Prisma wajib memuat indeks: ${idx}`
    );
    console.log(`✅ PASSED: Database Index: ${idx} ditemukan`);
  }

  console.log("\n=======================================================");
  console.log("🎉 SELURUH AUDIT KEAMANAN & QA (PHASE 9) LULUS 100%!");
  console.log("=======================================================\n");
}

runSecurityAndQATests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

