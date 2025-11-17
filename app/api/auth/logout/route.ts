<<<<<<< HEAD
=======
import { cookies } from "next/headers";
>>>>>>> origin/main
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("session");

  return NextResponse.json({ success: true });
}
