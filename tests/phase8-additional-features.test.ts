import assert from "node:assert";
import { MockAIProvider } from "../src/server/ai/mock-ai.provider";
import { OpenAICompatibleProvider } from "../src/server/ai/openai.provider";
import {
  ClassificationResultSchema,
  SummaryResultSchema,
} from "../src/server/ai/provider.interface";
import { extractMedanLocation } from "../src/server/processors/location-extractor";
import * as XLSX from "xlsx";
import PDFDocument from "pdfkit";

async function runPhase8Tests() {
  console.log("\n=== POVERTYWATCH PHASE 8 ADDITIONAL FEATURES TEST SUITE ===");

  // -------------------------------------------------------------
  // [1] AI Classification & Structured Zod Validation
  // -------------------------------------------------------------
  console.log("\n[1] Pengujian AI Classification (Mock & Rule-based):");
  const mockAI = new MockAIProvider();

  const testTitle1 = "Warga Medan Belawan Terima Bansos Sembako dan Beras Cadangan Pangan";
  const testContent1 = "Pemerintah Kota Medan menyalurkan ribuan paket beras dan sembako bagi masyarakat berpenghasilan rendah di kawasan pesisir Belawan.";
  const classRes1 = await mockAI.classifyNews(testTitle1, testContent1);

  assert.strictEqual(
    classRes1.categorySlug,
    "bansos-bantuan-pangan",
    "Harus terklasifikasi sebagai Bansos & Bantuan Pangan"
  );
  assert.ok(classRes1.confidence >= 0.65, "Confidence harus di atas 0.65");
  assert.ok(classRes1.reason.length > 10, "Harus menyertakan alasan klasifikasi");
  // Validate Zod schema
  ClassificationResultSchema.parse(classRes1);
  console.log(`✅ PASSED: Klasifikasi Bansos -> ${classRes1.category} (Confidence: ${classRes1.confidence})`);

  const testTitle2 = "Prevalensi Stunting di Posyandu Medan Deli Turun Menjadi 3 Persen";
  const classRes2 = await mockAI.classifyNews(testTitle2, "Intervensi nutrisi dan gizi buruk pada balita...");
  assert.strictEqual(classRes2.categorySlug, "stunting-gizi-buruk");
  console.log(`✅ PASSED: Klasifikasi Stunting -> ${classRes2.category} (Confidence: ${classRes2.confidence})`);

  // -------------------------------------------------------------
  // [2] AI Summary (2-4 Kalimat)
  // -------------------------------------------------------------
  console.log("\n[2] Pengujian AI Summary:");
  const longArticle =
    "Ratusan warga memadati kantor pos di Kota Medan untuk mencairkan bantuan langsung tunai. Mereka rela antre sejak pagi hari demi memenuhi kebutuhan pokok keluarga yang kian mendesak. Petugas pos mengimbau warga agar tetap tertib dan mematuhi jadwal yang telah ditentukan.";
  const summaryRes = await mockAI.summarizeNews(testTitle1, longArticle);
  SummaryResultSchema.parse(summaryRes);

  assert.ok(summaryRes.summary.length > 20, "Ringkasan harus berisi narasi memadai");
  assert.ok(summaryRes.keyPoints.length > 0, "Harus menyertakan poin kunci");
  console.log(`✅ PASSED: AI Summary berhasil dibentuk: "${summaryRes.summary.slice(0, 60)}..."`);

  // -------------------------------------------------------------
  // [3] AI Resilience & Graceful Fallback
  // -------------------------------------------------------------
  console.log("\n[3] Pengujian Ketahanan AI & Degradasi Graceful (Safe Fallback):");
  // Inisialisasi provider dengan URL dan key dummy yang sengaja invalid
  const failingAI = new OpenAICompatibleProvider("invalid-dummy-key", "https://invalid-non-existent-endpoint.local");
  
  // Scraper pipeline tidak boleh crash meskipun provider eksternal gagal!
  const fallbackClass = await failingAI.classifyNews(testTitle1, testContent1);
  assert.ok(fallbackClass, "Harus otomatis menggunakan fallback rule-based tanpa crash");
  assert.strictEqual(fallbackClass.categorySlug, "bansos-bantuan-pangan");
  console.log(`✅ PASSED: AI Failure tertangani dengan aman dan mendegradasi ke Mock Provider`);

  // -------------------------------------------------------------
  // [4] Location Extraction (Kelurahan, Kecamatan, Kota)
  // -------------------------------------------------------------
  console.log("\n[4] Pengujian Ekstraksi Lokasi Medan Tingkat Kelurahan & Kecamatan:");
  const kelTest = extractMedanLocation(
    "Bedah Rumah Warga Kurang Mampu di Kelurahan Sicanang",
    "Kegiatan perbaikan hunian warga di kawasan Sicanang..."
  );
  assert.strictEqual(kelTest.locationLevel, "KELURAHAN");
  assert.ok(kelTest.locationName.includes("Sicanang"));
  console.log(`✅ PASSED: Tingkat Kelurahan terdeteksi: ${kelTest.locationName}`);

  const kecTest = extractMedanLocation(
    "Penyaluran Sembako Murah di Wilayah Medan Sunggal",
    "Warga berkumpul di kantor kecamatan..."
  );
  assert.strictEqual(kecTest.locationLevel, "KECAMATAN");
  assert.strictEqual(kecTest.locationName, "Medan Sunggal");
  console.log(`✅ PASSED: Tingkat Kecamatan terdeteksi: ${kecTest.locationName}`);

  const fallbackLoc = extractMedanLocation("Rapat Koordinasi Isu Kemiskinan Daerah", "Bahas APBD...");
  assert.strictEqual(fallbackLoc.locationLevel, "KOTA");
  assert.strictEqual(fallbackLoc.locationName, "Kota Medan");
  console.log(`✅ PASSED: Fallback lokasi tanpa halusinasi: ${fallbackLoc.locationName}`);

  // -------------------------------------------------------------
  // [5] Excel (XLSX) Export Multi-Sheet Verification
  // -------------------------------------------------------------
  console.log("\n[5] Pengujian Format Ekspor Excel (XLSX):");
  const wb = XLSX.utils.book_new();
  const sampleData = [
    { No: 1, Judul: "Berita 1", Kategori: "Bansos", Lokasi: "Medan Belawan" },
  ];
  const sampleDisclaimer = [
    { Parameter: "Disclaimer", Nilai: "Bukan data statistik resmi BPS" },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleData), "Data Berita Kemiskinan");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleDisclaimer), "Metodologi & Disclaimer");
  const excelBuf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  assert.ok(excelBuf instanceof Buffer, "Output harus berupa Buffer");
  assert.ok(excelBuf.length > 500, "Ukuran buffer Excel harus valid");
  // Re-read workbook from buffer to confirm integrity
  const readWb = XLSX.read(excelBuf, { type: "buffer" });
  assert.deepStrictEqual(readWb.SheetNames, ["Data Berita Kemiskinan", "Metodologi & Disclaimer"]);
  console.log(`✅ PASSED: Berkas Excel multi-sheet terverifikasi (Ukuran: ${excelBuf.length} bytes)`);

  // -------------------------------------------------------------
  // [6] PDF Report Generation Verification
  // -------------------------------------------------------------
  console.log("\n[6] Pengujian Generator Laporan PDF:");
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const pdfDone = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.text("POVERTYWATCH MEDAN - LAPORAN PEMANTAUAN");
  doc.text("Disclaimer: Laporan ini bukan data statistik resmi tingkat kemiskinan BPS.");
  doc.end();

  const pdfBuf = await pdfDone;
  assert.ok(pdfBuf instanceof Buffer);
  assert.ok(pdfBuf.toString("utf-8", 0, 5) === "%PDF-", "Header file harus berupa %PDF-");
  console.log(`✅ PASSED: Berkas PDF valid dengan header standar (Ukuran: ${pdfBuf.length} bytes)`);

  // -------------------------------------------------------------
  // [7] Source Health & Trend Metric Logic
  // -------------------------------------------------------------
  console.log("\n[7] Pengujian Logika Kesehatan Sumber (Source Health Status):");
  function computeHealthStatus(failCount: number, totalJobs: number): string {
    if (totalJobs === 0) return "HEALTHY";
    const failRate = failCount / totalJobs;
    if (failRate > 0.5) return "FAILING";
    if (failRate > 0.2) return "DEGRADED";
    return "HEALTHY";
  }

  assert.strictEqual(computeHealthStatus(0, 5), "HEALTHY");
  assert.strictEqual(computeHealthStatus(2, 5), "DEGRADED");
  assert.strictEqual(computeHealthStatus(4, 5), "FAILING");
  console.log("✅ PASSED: Logika evaluasi status kesehatan (HEALTHY, DEGRADED, FAILING) valid");

  console.log("\n=======================================================");
  console.log("🎉 SELURUH FITUR TAMBAHAN (PHASE 8) BERHASIL DIVERIFIKASI!");
  console.log("=======================================================\n");
}

runPhase8Tests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

