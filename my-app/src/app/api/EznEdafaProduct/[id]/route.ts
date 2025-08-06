// المسار: /api/eznEdafaProduct/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const Eid = parseInt(id);

    if (isNaN(Eid)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const deletedItem = await prisma.eznEdafaProduct.delete({
      where: { id: Eid },
    });

    return NextResponse.json({ data: deletedItem }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product from Ezn Edafa:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
