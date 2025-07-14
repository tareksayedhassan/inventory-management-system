import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const treasuryId = parseInt(params.id);

    const transactions = await prisma.treasuryTransaction.findMany({
      where: { treasuryId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: transactions }, { status: 200 });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
