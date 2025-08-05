import { ClientSchema } from "@/utils/ValidationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { updateSupplierStatus } from "@/utils/supplierBalance";

export async function GET(req: NextRequest) {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!clients) {
    return NextResponse.json(
      {
        message: "not found clients",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: clients }, { status: 200 });
}
export async function POST(req: NextRequest) {
  try {
    const {
      phone,
      address,
      note,
      name,
      Campname,
      added_by_id,
      balance,
      tax_number,
    } = await req.json();

    const Validattions = ClientSchema.safeParse({
      phone,
      address,
      note,
      name,
      Campname,
      added_by_id,
      balance,
      tax_number,
    });

    if (!Validattions.success) {
      const err = Validattions.error.issues[0].message;

      return NextResponse.json({ message: err }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        phone: phone,
        address: address,
        note: note,
        name: name,
        Campname: Campname,
        balance: balance,
        added_by_id: added_by_id,
        tax_number: tax_number,
      },
    });
    await updateSupplierStatus(client.id, "client");
    const user = await prisma.user.findUnique({
      where: { id: added_by_id },
      select: { name: true },
    });

    const userName = user?.name || "مستخدم غير معروف";

    const redirectUrl = `/clients`;
    const now = new Date();
    const message = `تم إضافة عميل جديد "${name}" (هاتف: ${
      phone || "غير متوفر"
    }) بواسطة ${userName}`;

    await prisma.notification.create({
      data: {
        message,
        userId: added_by_id || null,
        redirectUrl,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    console.error("خطأ في السيرفر:", err);

    return NextResponse.json(
      {
        message: err?.message || JSON.stringify(err) || "حدث خطأ داخلي",
      },
      { status: 500 }
    );
  }
}
