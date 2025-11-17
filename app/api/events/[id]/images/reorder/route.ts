import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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

    // First, get all existing images and their tags
    const result = await cloudinary.search
      .expression(`folder:events/${eventNo}/*`)
      .with_field("tags")
      .max_results(500)
      .execute();

    // Remove existing order tags from all images
    const removePromises = result.resources.map(async (resource: any) => {
      const orderTags =
        resource.tags?.filter((tag: string) => tag.startsWith("order_")) || [];
      if (orderTags.length > 0) {
        try {
          await cloudinary.uploader.remove_tag(orderTags, [resource.public_id]);
          return true;
        } catch (error) {
          console.error(
            `[ImageUpload] Error removing tags for ${resource.public_id}:`,
            error
          );
          return false;
        }
      }
      return true;
    });

    await Promise.all(removePromises);

    // Update each image with its new order tag
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
