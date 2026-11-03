import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateSourceSchema } from "@/lib/validation/source.schema";
import { validateUrlForScraping } from "@/server/security/ssrf-guard";

export async function GET() {
  try {
    const sources = await prisma.newsSource.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { news: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: sources,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SOURCES_FETCH_ERROR",
          message: err instanceof Error ? err.message : "Gagal mengambil daftar sumber",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateSourceSchema.parse(body);

    // SSRF Validation
    const baseCheck = validateUrlForScraping(data.baseUrl);
    if (!baseCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "SSRF_BLOCKED", message: baseCheck.error },
        },
        { status: 400 }
      );
    }

    if (data.feedUrl) {
      const feedCheck = validateUrlForScraping(data.feedUrl);
      if (!feedCheck.valid) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "SSRF_BLOCKED", message: feedCheck.error },
          },
          { status: 400 }
        );
      }
    }

    const newSource = await prisma.newsSource.create({
      data: {
        name: data.name,
        baseUrl: data.baseUrl,
        feedUrl: data.feedUrl || undefined,
        type: data.type,
        scrapeFrequency: data.scrapeFrequency,
        isActive: data.isActive,
        selectorConfig: data.selectorConfig || undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newSource,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SOURCE_CREATE_ERROR",
          message: err instanceof Error ? err.message : "Gagal menambahkan sumber berita",
        },
      },
      { status: 400 }
    );
  }
}

