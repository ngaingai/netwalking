import type { CloudinaryImage } from "./events";

// Shared in-memory cache for event images
const imageCache = new Map<
  string,
  { images: CloudinaryImage[]; timestamp: number }
>();

// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function getCachedImages(eventNo: string): CloudinaryImage[] | null {
  const cached = imageCache.get(eventNo);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.images;
  }
  return null;
}

export function setCachedImages(
  eventNo: string,
  images: CloudinaryImage[]
): void {
  imageCache.set(eventNo, { images, timestamp: Date.now() });
}

export function invalidateCache(eventNo: string): void {
  imageCache.delete(eventNo);
}

export function getStaleCache(eventNo: string): CloudinaryImage[] | null {
  // Return cached data even if expired (useful when rate limited)
  const cached = imageCache.get(eventNo);
  return cached ? cached.images : null;
}

