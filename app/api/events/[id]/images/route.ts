import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface DeleteRequest {
  publicId: string;
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventNo = id;
    console.log(`[ImageUpload] Getting images for event: ${eventNo}`);

    const result = await cloudinary.search
      .expression(`folder:events/${eventNo}/*`)
      .sort_by("created_at", "asc")
      .execute();

    const images = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
    }));

    console.log(
      `[ImageUpload] Found ${images.length} images for event ${eventNo}`
    );
    return NextResponse.json(images);
  } catch (error) {
    console.error("[ImageUpload] Error getting images:", error);
    return NextResponse.json(
      { error: "Failed to get images" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventNo = id;
    console.log(`[ImageUpload] Processing upload for event: ${eventNo}`);

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      console.log("[ImageUpload] No files provided");
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: `events/${eventNo}`,
        resource_type: "auto",
      });

      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      };
    });

    const images = await Promise.all(uploadPromises);
    console.log(`[ImageUpload] Successfully uploaded ${images.length} images`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("[ImageUpload] Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventNo = id;
    console.log(`[ImageUpload] Processing delete for event: ${eventNo}`);

    const body = (await request.json()) as DeleteRequest;
    const { publicId } = body;

    if (!publicId) {
      console.log("[ImageUpload] No public ID provided for deletion");
      return NextResponse.json(
        { error: "No public ID provided" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);
    console.log(`[ImageUpload] Successfully deleted image: ${publicId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ImageUpload] Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
