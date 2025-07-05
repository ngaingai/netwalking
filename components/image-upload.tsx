"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  eventId: string;
  onUpdate?: () => void;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

export default function ImageUpload({ eventId, onUpdate }: ImageUploadProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [eventId]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/images`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = (await response.json()) as CloudinaryImage[];
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images");
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch(`/api/events/${eventId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return response.json();
    });

    try {
      await Promise.all(uploadPromises);
      toast.success("Images uploaded successfully");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/images`, {
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
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistically update the UI
    setImages(items);

    // Update the order in the backend
    try {
      const response = await fetch(`/api/events/${eventId}/images/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: items.map((img) => img.public_id) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image order");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update image order");
      }
      onUpdate?.();
    } catch (error) {
      console.error("Error updating image order:", error);
      // Revert the optimistic update on error
      await fetchImages();
      toast.error("Failed to update image order. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Event Images</h3>
        <div className="relative">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
              multiple
            />
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {images.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="images"
            direction="horizontal"
            isDropDisabled={false}
          >
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-wrap gap-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.public_id}
                    draggableId={image.public_id}
                    index={index}
                  >
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot
                    ) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative h-64 w-64 flex-shrink-0 ${
                          snapshot.isDragging ? "z-50 shadow-lg scale-105" : ""
                        }`}
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-lg border border-border">
                          <Image
                            src={image.secure_url}
                            alt={`Event image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="256px"
                            onError={() => {
                              toast.error("Failed to load image");
                            }}
                          />
                        </div>
                        <div
                          {...provided.dragHandleProps}
                          className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        >
                          <div className="absolute left-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                            <GripVertical className="h-4 w-4" />
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.public_id);
                          }}
                          className="absolute right-2 top-2 rounded-full bg-destructive/80 p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
