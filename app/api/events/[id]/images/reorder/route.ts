import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventNo = params.id;
    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: "Invalid images array provided" },
        { status: 400 }
      );
    }

    // Log the reorder request
    console.log(`Reordering ${images.length} images for event ${eventNo}`);

    // Read the current images data
    const imagesDataPath = path.join(
      process.cwd(),
      "data",
      `images-${eventNo}.json`
    );

    try {
      // Create the file if it doesn't exist
      await fs.access(imagesDataPath).catch(async () => {
        await fs.writeFile(imagesDataPath, JSON.stringify([]));
      });

      // Read existing images
      const existingImagesStr = await fs.readFile(imagesDataPath, "utf-8");
      const existingImages = JSON.parse(existingImagesStr);

      // Create a map of existing images for quick lookup
      const imageMap = new Map(
        existingImages.map((img: any) => [img.public_id, img])
      );

      // Create new ordered array using the provided order
      const orderedImages = images
        .map((publicId: string) => imageMap.get(publicId))
        .filter(Boolean);

      // Save the new order
      await fs.writeFile(
        imagesDataPath,
        JSON.stringify(orderedImages, null, 2)
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error accessing/writing images data:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error reordering images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}
