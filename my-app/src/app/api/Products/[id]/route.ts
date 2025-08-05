import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ProductId = parseInt(id, 10);
  try {
    await prisma.product.delete({
      where: { id: ProductId },
    });

    return NextResponse.json(
      { message: "product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ProductId = parseInt(id, 10);
  const body = await req.json();

  try {
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.productCode !== undefined)
      updateData.productCode = body.productCode;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.added_by_id !== undefined)
      updateData.added_by_id = body.added_by_id;
    if (body.updated_by_id !== undefined)
      updateData.updated_by_id = body.updated_by_id;

    const updatedTreasury = await prisma.treasury.update({
      where: { id: ProductId },
      data: updateData,
    });

    return NextResponse.json({ data: updatedTreasury }, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
