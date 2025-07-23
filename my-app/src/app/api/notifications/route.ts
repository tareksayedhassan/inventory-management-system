import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const treasuryIdParam = searchParams.get("treasuryId");
    const treasuryId = treasuryIdParam ? parseInt(treasuryIdParam) : null;

    const whereCondition = treasuryId ? { treasuryId } : {};

    const notifications = await prisma.notification.findMany({
      where: whereCondition,
      include: {
        user: { select: { name: true } },
        transaction: { select: { type: true, amount: true } },
        productMovement: {
          select: {
            type: true,
            quantity: true,
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "فشل في جلب الإشعارات", error: error.message },
      { status: 500 }
    );
  }
}
