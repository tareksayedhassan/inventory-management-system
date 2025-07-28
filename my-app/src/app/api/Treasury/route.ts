import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const Treasury = await prisma.treasury.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        added_by: true,
      },
    });

    return NextResponse.json(
      {
        data: Treasury,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Treasury:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const balance = parseFloat(formData.get("balance") as string);

    const added_by_id = parseInt(formData.get("added_by_id") as string, 10);

    const newTreasury = await prisma.treasury.create({
      data: {
        name,
        balance,
        added_by: { connect: { id: added_by_id } },
      },
    });

    return NextResponse.json(newTreasury, { status: 201 });
  } catch (error: any) {
    console.error("Error creating treasury:", error);
    return NextResponse.json(
      { message: "Error Added Treasury", error },
      { status: 500 }
    );
  }
}
