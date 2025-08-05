import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const clientId = parseInt(id);

  const DeleteClient = await prisma.client.delete({
    where: { id: clientId },
  });

  if (!DeleteClient) {
    return NextResponse.json(
      {
        message: "client Not Found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(
    {
      message: "client delete succsuflly",
    },
    { status: 201 }
  );
}
