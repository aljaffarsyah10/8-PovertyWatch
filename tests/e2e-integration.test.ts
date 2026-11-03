import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { normalizeNewsUrl } from "../src/server/processors/url-normalizer";
import { matchNewsKeywords } from "../src/server/processors/keyword-matcher";
import { extractMedanLocation } from "../src/server/processors/location-extractor";
import { validateUrlForScraping } from "../src/server/security/ssrf-guard";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runEndToEndVerification() {
  console.log("=== POVERTYWATCH PHASE 7 E2E INTEGRATION SUITE ===\n");

  // Step 1: Create Source Validation
  console.log("[E2E Step 1] Validasi Input Sumber Berita:");
  const validSource = {
    name: "Waspada Online",
    baseUrl: "https://waspada.id",
    feedUrl: "https://waspada.id/feed/",
    type: "RSS",
  };
  const ssrfCheck = validateUrlForScraping(validSource.baseUrl);
  assert(ssrfCheck.valid, "Validasi URL sumber lolos SSRF guard");

  // Step 2: Ingestion & Parsing
  console.log("\n[E2E Step 2] Ingestion & Parsing Feed:");
  const rssXml = fs.readFileSync(path.join(__dirname, "fixtures/sample-feed.xml"), "utf-8");
  const parser = new Parser();
  const feed = await parser.parseString(rssXml);
  assert(feed.items.length > 0, "Feed RSS menghasilkan artikel");

  // Step 3: Process Items (Normalize & Dedup & Match)
  console.log("\n[E2E Step 3] Normalisasi, Deduplikasi & Pencocokan Topik:");
  const processedItems = [];
  const processedUrls = new Set<string>();

  const keywords = ["bedah rumah", "rtlh", "stunting", "bansos"];

  for (const item of feed.items) {
    const rawUrl = item.link || "";
    const canonicalUrl = normalizeNewsUrl(rawUrl);

    // Dedup check
    if (processedUrls.has(canonicalUrl)) {
      continue;
    }
    processedUrls.add(canonicalUrl);

    const matchResult = matchNewsKeywords(item.title || "", item.contentSnippet || "", keywords);
    const loc = extractMedanLocation(item.title || "", item.contentSnippet || "");

    processedItems.push({
      title: item.title,
      url: canonicalUrl,
      isRelevant: matchResult.isRelevant,
      score: matchResult.relevanceScore,
      location: loc.locationName,
    });
  }

  assert(processedItems.length === 2, "2 artikel terproses dan terbebas dari duplikasi");
  assert(processedItems[0].location === "Medan Belawan", "Ekstraksi lokasi Medan Belawan terkonfirmasi");

  // Step 4: CSV Export formatting
  console.log("\n[E2E Step 4] Format Ekspor CSV:");
  const headers = ["ID", "Judul", "Lokasi", "URL"];
  const csvRows = processedItems.map((p, idx) => [
    `"${idx + 1}"`,
    `"${p.title}"`,
    `"${p.location}"`,
    `"${p.url}"`,
  ]);
  const csvOutput = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
  assert(csvOutput.includes("Medan Belawan"), "CSV output memuat kolom lokasi yang diekspor");
  assert(csvOutput.includes("Bedah Rumah"), "CSV output memuat judul artikel");

  console.log("\n=======================================================");
  console.log("🎉 SELURUH ALUR E2E (INTEGRATION FLOW) BERHASIL DIUJI!");
  console.log("=======================================================");
}

runEndToEndVerification().catch((e) => {
  console.error("E2E Test Failed:", e);
  process.exit(1);
});
