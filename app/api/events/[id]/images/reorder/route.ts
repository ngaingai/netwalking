import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventNo = id;
    console.log(`[ImageUpload] Processing reorder for event: ${eventNo}`);

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      console.log("[ImageUpload] No images array provided for reordering");
      return NextResponse.json(
        { error: "No images array provided" },
        { status: 400 }
      );
    }

    // Update each image with its order as a tag
    const updatePromises = images.map(
      async (publicId: string, index: number) => {
        try {
          await cloudinary.uploader.add_tag(`order_${index}`, [publicId]);
          return true;
        } catch (error) {
          console.error(
            `[ImageUpload] Error updating order for ${publicId}:`,
            error
          );
          return false;
        }
      }
    );

    const results = await Promise.all(updatePromises);
    const allSucceeded = results.every((result) => result === true);

    if (!allSucceeded) {
      return NextResponse.json(
        { error: "Failed to update some image orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ImageUpload] Error reordering images:", error);
    return NextResponse.json(
      { error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}
