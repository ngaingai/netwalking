import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface DeleteRequest {
  publicId: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  tags?: string[];
}

interface OrderedImage {
  public_id: string;
  secure_url: string;
  order: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventNo = id;
    console.log(`[ImageUpload] Getting images for event: ${eventNo}`);

    const result = await cloudinary.search
      .expression(`folder:events/${eventNo}/*`)
      .with_field("tags")
      .max_results(500)
      .execute();

    const images = result.resources
      .map(
        (resource: CloudinaryResource): OrderedImage => ({
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          order: resource.tags
            ? resource.tags
                .find((tag: string) => tag.startsWith("order_"))
                ?.split("_")[1] ?? null
            : null,
        })
      )
      .sort((a: OrderedImage, b: OrderedImage) => {
        // If both have order tags, sort by order
        if (a.order !== null && b.order !== null) {
          return parseInt(a.order) - parseInt(b.order);
        }
        // If only one has order, put the one without order at the end
        if (a.order === null) return 1;
        if (b.order === null) return -1;
        // If neither has order, maintain original order
        return 0;
      })
      .map(({ public_id, secure_url }: OrderedImage) => ({
        public_id,
        secure_url,
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventNo = id;
    console.log(`[ImageUpload] Processing upload for event: ${eventNo}`);

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      console.log("[ImageUpload] No files provided");
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Check file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        console.log(
          `[ImageUpload] File too large: ${file.name} (${file.size} bytes)`
        );
        return NextResponse.json(
          { error: `File ${file.name} exceeds the 10MB limit` },
          { status: 400 }
        );
      }
    }

    const uploadPromises = files.map(async (file) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: `events/${eventNo}`,
          resource_type: "auto",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 2000, crop: "limit" },
          ],
        });

        return {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        };
      } catch (error) {
        console.error(
          `[ImageUpload] Error uploading file ${file.name}:`,
          error
        );
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    const newImages = await Promise.all(uploadPromises);
    console.log(
      `[ImageUpload] Successfully uploaded ${newImages.length} images`
    );

    return NextResponse.json({ images: newImages });
  } catch (error) {
    console.error("[ImageUpload] Error uploading files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload files";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    // Delete from Cloudinary
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
