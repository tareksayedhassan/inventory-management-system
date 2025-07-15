import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// بيجيب كل العمليات الخاصة بالعميل أو المورد
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const companyId = parseInt(id, 10);

    const transactions = await prisma.companyTransaction.findMany({
      where: { companyId },
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
