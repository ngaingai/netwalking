"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageUploadProps {
  eventId?: string;
  eventNo: string;
  onImagesChange: (images: string[]) => void;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

function SortableImage({
  image,
  index,
  handleDelete,
}: {
  image: CloudinaryImage;
  index: number;
  handleDelete: (publicId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.public_id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
      }}
      className={`group relative h-64 w-64 flex-shrink-0 ${
        isDragging ? "shadow-lg scale-105" : ""
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-border">
        <Image
          src={image.secure_url}
          alt={`Event image ${index + 1}`}
          fill
          className="object-contain"
          sizes="256px"
          onError={() => toast.error("Failed to load image")}
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(image.public_id);
        }}
        className="absolute right-2 top-2 rounded-full bg-destructive/80 p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <div className="absolute left-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default function ImageUpload({
  eventNo,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  useEffect(() => {
    fetchImages();
  }, [eventNo]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/events/${eventNo}/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = (await response.json()) as CloudinaryImage[];
      setImages(data);
      onImagesChange(data.map((img) => img.secure_url));
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/api/events/${eventNo}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = (await response.json()) as { images: CloudinaryImage[] };
      const newImages = [...images, ...data.images];
      setImages(newImages);
      onImagesChange(newImages.map((img) => img.secure_url));
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      const response = await fetch(`/api/events/${eventNo}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      const newImages = images.filter((img) => img.public_id !== publicId);
      setImages(newImages);
      onImagesChange(newImages.map((img) => img.secure_url));
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.public_id === active.id);
    const newIndex = images.findIndex((img) => img.public_id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedImages = arrayMove(images, oldIndex, newIndex);
    setImages(reorderedImages);
    onImagesChange(reorderedImages.map((img) => img.secure_url));

    try {
      const response = await fetch(`/api/events/${eventNo}/images/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: reorderedImages.map((img) => img.public_id) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image order");
      }
    } catch (error) {
      console.error("Error updating image order:", error);
      toast.error("Failed to update image order");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Images</h3>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
            multiple
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Images"}
          </label>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((image) => image.public_id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.public_id}
                  image={image}
                  index={index}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No images uploaded yet. Click the button above to upload images.
          </p>
        </div>
      )}
    </div>
  );
}
