import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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

    // In a production app, you would store the order in a database
    // For now, we'll just return success since Cloudinary doesn't support reordering
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder images" },
      { status: 500 }
    );
  }
}
