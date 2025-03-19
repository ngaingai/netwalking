import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSession } from "@/lib/sessions";

/**
 * Rate limiting configuration
 */
const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
} as const;

/**
 * Store for rate limiting
 */
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

/**
 * Checks if a request is within rate limits
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > RATE_LIMIT.windowMs) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * Validates the API key for protected endpoints
 */
function checkApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.API_KEY;
}

/**
 * Gets the client IP from the request
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
}

/**
 * Validates admin authentication
 */
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get("admin_session");
  if (!sessionCookie?.value) {
    return false;
  }

  return await isValidSession(sessionCookie.value);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // For non-GET requests, require API key, except for login endpoint and image uploads
    if (request.method !== "GET" && !pathname.startsWith("/api/auth/login")) {
      // For image uploads and event updates, require admin authentication
      if (
        (pathname.includes("/api/events/") && pathname.includes("/images")) ||
        (pathname.startsWith("/api/events/") && request.method === "PUT")
      ) {
        if (!(await checkAdminAuth(request))) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else if (!checkApiKey(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!(await checkAdminAuth(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
