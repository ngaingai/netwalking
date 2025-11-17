"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CloudinaryImage } from "@/lib/events";

interface EventGalleryProps {
<<<<<<< HEAD
  eventId?: string;
=======
>>>>>>> origin/main
  images: CloudinaryImage[];
}

export function EventGallery({ images }: EventGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) {
    return (
      <div className="relative w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex].secure_url}
          alt={`Event image ${currentIndex + 1}`}
          width={1200}
          height={675}
          className="object-cover w-full h-full"
          priority
        />

        {/* Navigation Arrows */}
        <button
          onClick={previousImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image.public_id}
            onClick={() => setCurrentIndex(index)}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
              currentIndex === index ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image
              src={image.secure_url}
              alt={`Thumbnail ${index + 1}`}
              width={300}
              height={225}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
