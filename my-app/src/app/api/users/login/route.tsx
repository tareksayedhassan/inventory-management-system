import { loginValidate } from "@/utils/ValidationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import generateJWT from "@/utils/generateJWT";
interface User {
  email: string;
  password: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as User;

    const validation = loginValidate.safeParse(body);

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

    if (!user || !user.password) {
      return NextResponse.json(
        {
          message: "User not found or password is missing",
        },
        { status: 404 }
      );
    }

    const matchedPassworrd = await bcrypt.compare(data.password, user.password);

    if (!matchedPassworrd) {
      return NextResponse.json(
        {
          message: "Invaild Password",
        },
        { status: 401 }
      );
    }

    const token = await generateJWT({
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
      avatar: user.avatar,
    });

    return NextResponse.json(
      {
        token: token,
        message: "login successfuly",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
