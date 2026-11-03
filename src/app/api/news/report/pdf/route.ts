import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import PDFDocument from "pdfkit";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const whereClause: Record<string, unknown> = {};
    if (categoryId && categoryId !== "ALL") {
      whereClause.categoryId = categoryId;
    }

    const [newsList, totalCount, categories] = await Promise.all([
      prisma.news.findMany({
        where: whereClause,
        include: {
          source: { select: { name: true } },
          category: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 30,
      }),
      prisma.news.count(),
      prisma.category.findMany({
        include: { _count: { select: { news: true } } },
      }),
    ]);

    // Generate PDF document in-memory
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      info: {
        Title: "PovertyWatch - Laporan Pemantauan Media Sosial Ekonomi Kota Medan",
        Author: "PovertyWatch System",
      },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    // 1. Header & Title
    doc
      .fillColor("#0f172a")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("POVERTYWATCH MEDAN", { align: "left" });

    doc
      .fillColor("#0d9488")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Laporan Pemantauan Fenomena Sosial Ekonomi & Isu Kemiskinan Lokal", {
        align: "left",
      });

    doc.moveDown(0.5);

    doc
      .fillColor("#64748b")
      .fontSize(9)
      .font("Helvetica")
      .text(
        `Waktu Pembuatan: ${new Date().toLocaleString("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        })} | Total Database: ${totalCount} artikel`,
        { align: "left" }
      );

    doc.moveDown(1);
    doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    // 2. Metodologi & Disclaimer Box (Mandatory per PRD)
    doc
      .rect(40, doc.y, 515, 60)
      .fillAndStroke("#f8fafc", "#e2e8f0");

    const disclaimerY = doc.y - 52;
    doc
      .fillColor("#b91c1c")
      .fontSize(8)
      .font("Helvetica-Bold")
      .text("PERNYATAAN BATASAN METODOLOGI & DISCLAIMER:", 50, disclaimerY);

    doc
      .fillColor("#475569")
      .fontSize(7.5)
      .font("Helvetica")
      .text(
        "Data yang disajikan dalam laporan ini merupakan agregasi otomatis dari publikasi media daring lokal Kota Medan. Angka dan frekuensi mencerminkan atensi pemberitaan jurnalistik dan BUKAN merupakan statistik resmi tingkat kemiskinan dari Badan Pusat Statistik (BPS) maupun sensus pemerintah. PovertyWatch berfungsi sebagai alat pemantauan opini publik.",
        50,
        disclaimerY + 12,
        { width: 495, lineGap: 1.5 }
      );

    doc.y = disclaimerY + 70;
    doc.moveDown(1);

    // 3. Ringkasan Distribusi Kategori
    doc
      .fillColor("#0f172a")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Ringkasan Distribusi Kategori Isu:");

    doc.moveDown(0.5);

    const activeCategories = categories.filter((c) => c._count.news > 0).slice(0, 6);
    let catText = "";
    if (activeCategories.length > 0) {
      catText = activeCategories
        .map((c) => `• ${c.name}: ${c._count.news} artikel`)
        .join("   |   ");
    } else {
      catText = "Belum ada artikel terkategori dalam basis data saat ini.";
    }

    doc
      .fillColor("#334155")
      .fontSize(8.5)
      .font("Helvetica")
      .text(catText, { lineGap: 2 });

    doc.moveDown(1);
    doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    // 4. Daftar Artikel Terkini
    doc
      .fillColor("#0f172a")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Daftar Artikel Terkini (${newsList.length} Ditampilkan):`);

    doc.moveDown(0.5);

    newsList.forEach((item, index) => {
      // Check if we need a new page
      if (doc.y > 720) {
        doc.addPage();
      }

      doc
        .fillColor("#0f172a")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(`${index + 1}. ${item.title}`);

      doc
        .fillColor("#0d9488")
        .fontSize(7.5)
        .font("Helvetica")
        .text(
          `Sumber: ${item.source?.name || "N/A"} | Kategori: ${
            item.category?.name || "Umum"
          } | Lokasi: ${item.locationName || "Kota Medan"} | Tanggal: ${
            item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID") : "-"
          }`
        );

      if (item.aiSummary) {
        doc
          .fillColor("#64748b")
          .fontSize(7.5)
          .font("Helvetica-Oblique")
          .text(`Ringkasan AI: ${item.aiSummary.slice(0, 180)}...`, { width: 515 });
      }

      doc.moveDown(0.5);
    });

    // Finalize PDF
    doc.end();

    const pdfBuffer = await pdfPromise;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="povertywatch_report_${Date.now()}.pdf"`,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    logger.error({ error }, "Error generating PDF report");
    return NextResponse.json(
      {
        success: false,
        error: "Gagal membuat laporan PDF.",
      },
      { status: 500 }
    );
  }
}
