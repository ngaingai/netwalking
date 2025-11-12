import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface ReorderRequest {
  images: string[];
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventNo = id;
    console.log(`[ImageReorder] Processing reorder for event: ${eventNo}`);

    const body = (await request.json()) as ReorderRequest;
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      console.log("[ImageReorder] Invalid images array provided");
      return NextResponse.json(
        { error: "Invalid images array provided" },
        { status: 400 }
      );
    }

    // Verify all images exist in the event folder
    for (const publicId of images) {
      try {
        const result = await cloudinary.api.resource(publicId);
        if (!result.folder?.startsWith(`events/${eventNo}/`)) {
          console.error(
            `[ImageReorder] Image ${publicId} not found in event folder`
          );
          return NextResponse.json(
            { error: `Image not found: ${publicId}` },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error(`[ImageReorder] Image not found: ${publicId}`);
        return NextResponse.json(
          { error: `Image not found: ${publicId}` },
          { status: 404 }
        );
      }
    }

    // Note: Cloudinary doesn't support reordering in folders
    // We'll maintain the order in our application state
    console.log(`[ImageReorder] Successfully verified ${images.length} images`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ImageReorder] Error reordering images:", error);
    return NextResponse.json(
      { error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}
