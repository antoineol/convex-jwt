import { createJWT } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const jwt = await createJWT({
      sub: "test-user",
    });
    return NextResponse.json({ token: jwt });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

