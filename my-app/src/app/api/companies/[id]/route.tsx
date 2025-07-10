import { CompStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

interface Company {
  system_nums: number;
  photo: string;
  active: CompStatus;
  general_alert: string;
  address: string;
  phone: string;
  com_code: number;
  added_by_id: number;
  updaeted_by_id: number;
}
// get single setting
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  try {
    const setting = await prisma.company.findUnique({
      where: { id },
    });

    if (!setting) {
      return NextResponse.json(
        {
          message: "setting Not Found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: setting,
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
    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Setting deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting setting:", error);
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
  const body = (await req.json()) as Company;

  try {
    const updateData: any = {};

    if (body.system_nums !== undefined)
      updateData.system_nums = body.system_nums;
    if (body.photo !== undefined) updateData.photo = body.photo;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.general_alert !== undefined)
      updateData.general_alert = body.general_alert;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.com_code !== undefined) updateData.com_code = body.com_code;

    if (body.added_by_id !== undefined) {
      updateData.added_by = { connect: { id: body.added_by_id } };
    }

    if (body.updaeted_by_id !== undefined) {
      updateData.updaeted_by = { connect: { id: body.updaeted_by_id } };
    }

    const updatedSetting = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updatedSetting }, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
