"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";

interface ImageData {
  url: string;
  publicId: string;
}

interface PropertyImageGalleryProps {
  images: ImageData[];
  title: string;
}

export default function PropertyImageGallery({
  images,
  title,
}: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isLightboxOpen, goToNext, goToPrev]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    if (!isMobile) {
      setIsLightboxOpen(true);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="mb-8 flex h-96 w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="text-center">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Container */}
      <div className="mb-8">
        {/* Main Image Display */}
        <div className="relative mb-4 h-96 w-full overflow-hidden rounded-lg bg-gray-200 md:h-[500px]">
          <Image
            src={images[currentIndex].url}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="cursor-pointer object-cover transition-opacity duration-300 hover:opacity-95"
            onClick={() => setIsLightboxOpen(true)}
            priority
          />

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation Buttons - Desktop Only */}
          {!isMobile && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goToImage(idx)}
                className={`relative h-20 overflow-hidden rounded-lg transition-all duration-200 md:h-24 ${
                  currentIndex === idx
                    ? "ring-2 ring-blue-600 ring-offset-2"
                    : "hover:ring-2 hover:ring-blue-400 hover:ring-offset-1"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 15vw"
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile Navigation Info */}
        {isMobile && images.length > 1 && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Swipe left/right or tap thumbnails to navigate • Tap image for fullscreen
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Content */}
          <div
            className="relative flex h-full w-full flex-col items-center justify-center md:max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/40"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main Image in Lightbox */}
            <div className="relative h-[70vh] w-full md:h-[80vh] md:max-h-[600px] md:max-w-4xl">
              <Image
                src={images[currentIndex].url}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Navigation Buttons in Lightbox */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={goToPrev}
                className="rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Image Counter in Lightbox */}
              <div className="min-w-[100px] text-center text-white">
                <p className="text-lg font-semibold">{currentIndex + 1} / {images.length}</p>
              </div>

              <button
                onClick={goToNext}
                className="rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Lightbox Thumbnail Scroll */}
            <div className="mt-6 flex max-h-20 w-full gap-2 overflow-x-auto px-4 pb-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                    currentIndex === idx
                      ? "ring-2 ring-blue-400"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>

            {/* Keyboard Help Text */}
            <p className="mt-4 text-center text-sm text-gray-400">
              Use arrow keys to navigate • ESC to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
