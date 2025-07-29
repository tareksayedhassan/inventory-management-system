import { CompStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Treasury {
  name: string;
  is_master: boolean;
  last_exchange_receipt_number: number;
  last_collect_receipt_number: number;

  added_by_id: number;
  updaeted_by_id: number;
}

// get single setting
export async function GET(
  req: NextRequest,

  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const treasuryId = parseInt(id, 10);
  try {
    const treasury = await prisma.treasury.findUnique({
      where: { id: treasuryId },
    });

    if (!treasury) {
      return NextResponse.json(
        {
          message: "treasury Not Found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: treasury,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  try {
    await prisma.treasury.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "treasury deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting treasury:", error);
    return NextResponse.json(
      { message: "500 Internal Server Error", error: error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const body = (await req.json()) as Treasury;

  try {
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.is_master !== undefined) updateData.is_master = body.is_master;
    if (body.last_exchange_receipt_number !== undefined)
      updateData.last_exchange_receipt_number =
        body.last_exchange_receipt_number;
    if (body.last_collect_receipt_number !== undefined)
      updateData.last_collect_receipt_number = body.last_collect_receipt_number;

    if (body.added_by_id !== undefined) {
      updateData.added_by_id = body.added_by_id;
    }

    if (body.updaeted_by_id !== undefined) {
      updateData.updated_by_id = body.updaeted_by_id;
    }

    const updatedTreasury = await prisma.treasury.update({
      where: { id },
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
