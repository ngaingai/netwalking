import { cookies } from "next/headers";

/**
 * Session configuration
 */
const SESSION_CONFIG = {
  name: "admin_session",
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  },
} as const;

// Debug logging
console.log("Initializing sessions store");

/**
 * Adds a new admin session
 * @param token - The session token to store
 */
export async function addSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.name, token, {
    ...SESSION_CONFIG.options,
    maxAge: SESSION_CONFIG.maxAge,
  });
  console.log(`[Session] Added new session: ${token}`);
}

/**
 * Removes the current admin session
 */
export async function removeSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.name);
  console.log("[Session] Removed current session");
}

/**
 * Validates a session token
 * @param token - The session token to validate
 * @returns Promise<boolean> - Whether the session is valid
 */
export async function isValidSession(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_CONFIG.name);

  if (!sessionCookie || sessionCookie.value !== token) {
    console.log(`[Session] Invalid session: ${token}`);
    return false;
  }

  console.log(`[Session] Valid session: ${token}`);
  return true;
}

// Helper function to get all valid sessions
export async function getValidSessions(): Promise<string[]> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_CONFIG.name);
  return sessionCookie ? [sessionCookie.value] : [];
}
