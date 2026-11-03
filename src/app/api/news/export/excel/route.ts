import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import * as XLSX from "xlsx";
import { sanitizeFormulaInjection } from "@/server/security/sanitize-export";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const sourceId = searchParams.get("sourceId");
    const location = searchParams.get("location");

    // Query filter
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId && categoryId !== "ALL") {
      whereClause.categoryId = categoryId;
    }

    if (sourceId && sourceId !== "ALL") {
      whereClause.sourceId = sourceId;
    }

    if (location && location !== "ALL") {
      whereClause.locationName = { contains: location, mode: "insensitive" };
    }

    // Ambil data
    const newsList = await prisma.news.findMany({
      where: whereClause,
      include: {
        source: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 2000,
    });

    // 1. Data Sheet
    const dataRows = newsList.map((item, idx) => ({
      No: idx + 1,
      ID: sanitizeFormulaInjection(item.id),
      "Judul Berita": sanitizeFormulaInjection(item.title),
      "Sumber Media": sanitizeFormulaInjection(item.source?.name || "N/A"),
      "Kategori Fenomena": sanitizeFormulaInjection(item.category?.name || "Belum Terkategori"),
      "Wilayah / Lokasi": sanitizeFormulaInjection(item.locationName || "Kota Medan"),
      "Level Wilayah": sanitizeFormulaInjection(item.locationLevel || "KOTA"),
      "Ringkasan AI": sanitizeFormulaInjection(item.aiSummary || item.description || "-"),
      "Keyakinan AI (Confidence)": item.aiConfidence ? `${(item.aiConfidence * 100).toFixed(0)}%` : "-",
      "Alasan Klasifikasi": sanitizeFormulaInjection(item.aiReason || "-"),
      "Tanggal Publikasi": item.publishedAt
        ? new Date(item.publishedAt).toLocaleString("id-ID")
        : "-",
      "Tautan Berita Asli": sanitizeFormulaInjection(item.url),
    }));

    // 2. Disclaimer Sheet
    const disclaimerRows = [
      {
        Parameter: "Nama Produk",
        Keterangan: "PovertyWatch — Platform Pemantauan Berita Sosial Ekonomi Kota Medan",
      },
      {
        Parameter: "Tanggal Ekspor",
        Keterangan: new Date().toLocaleString("id-ID"),
      },
      {
        Parameter: "Total Baris Data",
        Keterangan: `${newsList.length} artikel terverifikasi`,
      },
      {
        Parameter: "Disclaimer Resmi & Batasan Metodologis",
        Keterangan:
          "Data yang tersaji dalam berkas ini dihimpun secara otomatis dari portal berita publik lokal Kota Medan. Angka frekuensi berita mencerminkan atensi liputan media jurnalistik dan BUKAN merupakan statistik resmi tingkat kemiskinan, sensus, atau angka kemiskinan resmi Badan Pusat Statistik (BPS).",
      },
      {
        Parameter: "Klasifikasi AI",
        Keterangan:
          "Penetapan kategori dan ringkasan dibantu oleh algoritma pencocokan kata kunci dan model kecerdasan buatan (AI) otomatis. Skor keyakinan adalah estimasi heuristik dan bukan probabilitas statistik terkalibrasi.",
      },
    ];

    const wb = XLSX.utils.book_new();

    const wsData = XLSX.utils.json_to_sheet(dataRows);
    const wsDisclaimer = XLSX.utils.json_to_sheet(disclaimerRows);

    // Atur lebar kolom untuk Sheet Data
    wsData["!cols"] = [
      { wch: 5 },  // No
      { wch: 38 }, // ID
      { wch: 45 }, // Judul Berita
      { wch: 20 }, // Sumber Media
      { wch: 25 }, // Kategori Fenomena
      { wch: 25 }, // Wilayah / Lokasi
      { wch: 15 }, // Level Wilayah
      { wch: 50 }, // Ringkasan AI
      { wch: 15 }, // Keyakinan AI
      { wch: 35 }, // Alasan Klasifikasi
      { wch: 22 }, // Tanggal Publikasi
      { wch: 40 }, // Tautan Berita Asli
    ];

    wsDisclaimer["!cols"] = [{ wch: 25 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(wb, wsData, "Data Berita Kemiskinan");
    XLSX.utils.book_append_sheet(wb, wsDisclaimer, "Metodologi & Disclaimer");

    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="povertywatch_export_${Date.now()}.xlsx"`,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    logger.error({ error }, "Error exporting news to Excel");
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengekspor data ke format Excel.",
      },
      { status: 500 }
    );
  }
}
