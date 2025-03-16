"use server";

import fs from "fs/promises";
import path from "path";

export async function getEventImages(eventNo: string): Promise<string[]> {
  const eventDir = path.join(
    process.cwd(),
    "public",
    "images",
    "events",
    eventNo
  );

  try {
    // Check if directory exists
    try {
      await fs.access(eventDir);
    } catch {
      // Directory doesn't exist, return empty array
      return [];
    }

    const files = await fs.readdir(eventDir);
    return files
      .filter((file: string) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .sort((a: string, b: string) => {
        const numA = parseInt(a.split(".")[0]);
        const numB = parseInt(b.split(".")[0]);
        return numA - numB;
      });
  } catch (error) {
    console.error(`Error reading images for event ${eventNo}:`, error);
    return [];
  }
}
