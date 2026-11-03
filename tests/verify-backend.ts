import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { validateUrlForScraping } from "../src/server/security/ssrf-guard";
import { normalizeNewsUrl } from "../src/server/processors/url-normalizer";
import { cleanText } from "../src/server/processors/text-cleaner";
import { matchNewsKeywords } from "../src/server/processors/keyword-matcher";
import { extractMedanLocation } from "../src/server/processors/location-extractor";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runVerification() {
  console.log("=== POVERTYWATCH BACKEND LOGIC VERIFICATION ===\n");

  // 1. SSRF Protection Tests
  console.log("[1] Pengujian SSRF Guard:");
  const localCheck = validateUrlForScraping("http://localhost:3000/api");
  assert(!localCheck.valid, "SSRF memblokir localhost");

  const privateIpCheck = validateUrlForScraping("http://192.168.1.1/admin");
  assert(!privateIpCheck.valid, "SSRF memblokir private IP 192.168.x.x");

  const metadataCheck = validateUrlForScraping("http://169.254.169.254/latest/meta-data");
  assert(!metadataCheck.valid, "SSRF memblokir AWS/Cloud metadata IP");

  const validWebCheck = validateUrlForScraping("https://waspada.id/feed/");
  assert(validWebCheck.valid, "SSRF mengizinkan domain publik https://waspada.id");

  // 2. URL Normalization Tests
  console.log("\n[2] Pengujian Normalisasi URL:");
  const dirtyUrl = "https://Waspada.id/medan/bedah-rumah/?utm_source=rss&utm_medium=feed&fbclid=12345#section";
  const cleanUrl = normalizeNewsUrl(dirtyUrl);
  assert(
    cleanUrl === "https://waspada.id/medan/bedah-rumah",
    `Normalisasi URL: ${cleanUrl}`
  );

  // 3. Text Cleaner Tests
  console.log("\n[3] Pengujian Pembersih Teks (Text Cleaner):");
  const rawHtml = "<p>Warga &quot;Medan Belawan&quot; &amp; sekitarnya&nbsp;terdampak.</p>";
  const cleaned = cleanText(rawHtml);
  assert(
    cleaned === 'Warga "Medan Belawan" & sekitarnya terdampak.',
    `Pembersihan HTML & Entitas: ${cleaned}`
  );

  // 4. Keyword Matching Tests
  console.log("\n[4] Pengujian Pencocokan Kata Kunci (Keyword Matcher):");
  const keywords = ["bedah rumah", "rtlh", "stunting", "bansos"];
  const match1 = matchNewsKeywords(
    "Pemko Medan Gulirkan Program Bedah Rumah di Belawan",
    "Bantuan RTLH disalurkan bagi warga pra-sejahtera",
    keywords
  );
  assert(match1.isRelevant && match1.matchedKeywords.includes("bedah rumah"), "Keyword bedah rumah terdeteksi");
  assert(match1.relevanceScore >= 0.4, "Skor relevansi dihitung dengan benar");

  // 5. Location Extractor Tests
  console.log("\n[5] Pengujian Ekstraksi Lokasi Medan:");
  const loc1 = extractMedanLocation("Pasar Murah Beras SPHP Diserbu Ribuan Buruh di Medan Deli", "");
  assert(loc1.locationName === "Medan Deli" && loc1.locationLevel === "KECAMATAN", "Kecamatan Medan Deli terdeteksi");

  const loc2 = extractMedanLocation("Banjir rob rendam pemukiman nelayan Belawan", "");
  assert(loc2.locationName === "Medan Belawan", "Short name Belawan terdeteksi");

  // 6. RSS Fixture Test
  console.log("\n[6] Pengujian RSS Parser terhadap Fixture sample-feed.xml:");
  const rssXml = fs.readFileSync(path.join(__dirname, "fixtures/sample-feed.xml"), "utf-8");
  const rssParser = new Parser();
  const feed = await rssParser.parseString(rssXml);
  assert(feed.items.length === 2, "RSS Parser berhasil mengekstrak 2 artikel dari fixture");
  assert(Boolean(feed.items[0].title?.includes("Bedah Rumah")), "Judul item 1 sesuai fixture");

  // 7. Malformed Feed Resilience Test
  console.log("\n[7] Pengujian Ketahanan Feed Cacat (malformed-feed.xml):");
  const malformedXml = fs.readFileSync(path.join(__dirname, "fixtures/malformed-feed.xml"), "utf-8");
  const malformedFeed = await rssParser.parseString(malformedXml);
  const validItems = malformedFeed.items.filter(
    (item) => item.title && item.title.trim().length >= 5 && item.link && item.link.startsWith("http")
  );
  assert(validItems.length === 0, "Validasi artikel berhasil memfilter seluruh item cacat/rusak");

  // 8. HTML Fixture Test (Cheerio)
  console.log("\n[8] Pengujian HTML Parser (Cheerio) terhadap sample-news.html:");
  const htmlContent = fs.readFileSync(path.join(__dirname, "fixtures/sample-news.html"), "utf-8");
  const $ = cheerio.load(htmlContent);
  const items: string[] = [];
  $(".news-list-item").each((_, el) => {
    const title = $(el).find(".title > a").text().trim();
    if (title) items.push(title);
  });
  assert(items.length === 2, "HTML Scraper berhasil mengekstrak 2 artikel via CSS selector");

  console.log("\n=======================================================");
  console.log("🎉 SELURUH PENGUJIAN LOGIKA BACKEND & SCRAPER BERHASIL!");
  console.log("=======================================================");
}

runVerification().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
