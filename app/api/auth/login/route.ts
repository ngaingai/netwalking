import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { addSession } from "@/lib/sessions";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Validate environment variables
    if (!process.env.ADMIN_PASSWORD_HASH) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify password
    const isValid = await bcryptjs.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (isValid) {
      // Generate a random session token
      const sessionToken = crypto.randomUUID();

      // Add the session token to the valid sessions set
      await addSession(sessionToken);

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
