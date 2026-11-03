import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { UpdateSourceSchema } from "@/lib/validation/source.schema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateSourceSchema.parse(body);

    const updated = await prisma.newsSource.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.baseUrl && { baseUrl: data.baseUrl }),
        ...(data.feedUrl !== undefined && { feedUrl: data.feedUrl }),
        ...(data.type && { type: data.type }),
        ...(data.scrapeFrequency && { scrapeFrequency: data.scrapeFrequency }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.selectorConfig !== undefined && {
          selectorConfig: data.selectorConfig || undefined,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SOURCE_UPDATE_ERROR",
          message: err instanceof Error ? err.message : "Gagal memperbarui sumber berita",
        },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.newsSource.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Sumber dengan ID ${id} berhasil dihapus.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SOURCE_DELETE_ERROR",
          message: err instanceof Error ? err.message : "Gagal menghapus sumber berita",
        },
      },
      { status: 400 }
    );
  }
}
