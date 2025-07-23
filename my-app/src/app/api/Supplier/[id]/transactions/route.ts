import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// بيجيب كل العمليات الخاصة بالمورد (Supplier)
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supplierId = parseInt(id, 10);

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { message: "Invalid supplier ID" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { supplierId },
      orderBy: { createdAt: "desc" },
      include: {
        treasury: { select: { id: true, name: true } },
      },
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
