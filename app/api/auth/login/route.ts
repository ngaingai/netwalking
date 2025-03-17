import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { ADMIN_PASSWORD_HASH } from "@/config";
import { addSession } from "@/lib/sessions";

interface LoginRequest {
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;
    let { password } = body;

    // Trim any whitespace from the password
    password = password.trim();

    // Debug logging
    console.log("Login attempt with password:", password);
    console.log("Password length:", password.length);
    console.log(
      "Password characters:",
      [...password].map((c) => c.charCodeAt(0))
    );

    // Log all environment variables (without sensitive values)
    console.log("Environment variables available:", Object.keys(process.env));
    console.log(
      "ADMIN_PASSWORD_HASH exists:",
      !!process.env.ADMIN_PASSWORD_HASH
    );
    console.log(
      "ADMIN_PASSWORD_HASH length:",
      process.env.ADMIN_PASSWORD_HASH?.length
    );
    console.log(
      "ADMIN_PASSWORD_HASH first 10 chars:",
      process.env.ADMIN_PASSWORD_HASH?.substring(0, 10)
    );

    console.log("Using hash from config");
    console.log("Hash length:", ADMIN_PASSWORD_HASH.length);
    console.log("Hash:", ADMIN_PASSWORD_HASH);

    const isValid = await bcryptjs.compare(password, ADMIN_PASSWORD_HASH);
    console.log("Password comparison result:", isValid);

    if (isValid) {
      // Generate a random session token
      const sessionToken = crypto.randomUUID();

      // Add the session token to the valid sessions set
      await addSession(sessionToken);
      console.log("Added session token to valid sessions");

      // Set a secure HTTP-only cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    // Add a small delay to prevent timing attacks
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
