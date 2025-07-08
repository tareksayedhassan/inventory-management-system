import { NextRequest, NextResponse } from "next/server";
import { registervalidate } from "@/utils/ValidationSchemas";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma";
import generateJWT from "@/utils/generateJWT";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as User;

  const validation = registervalidate.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        message: validation.error.issues[0],
      },
      { status: 400 }
    );
  }

  const data = validation.data;

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user) {
    return NextResponse.json(
      {
        message: "Email aleady exists",
      },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role === "admin" ? Role.admin : Role.user,
      },
    });

    const token = await generateJWT({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    return NextResponse.json(
      {
        message: "User created successfully",
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        message: "Failed to create user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
