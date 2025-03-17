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

    // Since Cloudinary doesn't support reordering directly,
    // we'll just verify that all images exist
    const result = await cloudinary.search
      .expression(`folder:events/${eventNo}/*`)
      .execute();

    const existingIds = new Set(result.resources.map((r: any) => r.public_id));
    const allImagesExist = images.every((id: string) => existingIds.has(id));

    if (!allImagesExist) {
      console.log("[ImageUpload] Some images in the order don't exist");
      return NextResponse.json(
        { error: "Some images don't exist" },
        { status: 400 }
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
