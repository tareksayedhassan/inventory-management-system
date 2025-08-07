import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const eznEdafaId = parseInt(id);

    if (isNaN(eznEdafaId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const eznEdafa = await prisma.eznEdafa.findUnique({
      where: { id: eznEdafaId },
      include: {
        supplier: true,
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!eznEdafa) {
      return NextResponse.json(
        { message: "إذن الإضافة غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: eznEdafa }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Ezn Edafa:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eznEdafaId = parseInt(id);

    if (isNaN(eznEdafaId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // تحقق من وجود الإذن
    const eznEdafaExists = await prisma.eznEdafa.findUnique({
      where: { id: eznEdafaId },
    });

    if (!eznEdafaExists) {
      return NextResponse.json(
        { message: "إذن الإضافة غير موجود" },
        { status: 404 }
      );
    }

    const eznEdafa = await prisma.eznEdafa.delete({
      where: { id: eznEdafaId },
    });

    return NextResponse.json({ data: eznEdafa }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Ezn Edafa:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error },
      { status: 500 }
    );
  }
}
