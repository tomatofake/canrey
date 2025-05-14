"use client";
import { useState, useEffect, useCallback } from "react";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";

const ProductGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
      if (event.key === "Escape") setIsModalOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 justify-center items-start mr-16">
      <div className="flex xl:flex-col gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`border-2 p-1 rounded-md transition ${
              selectedIndex === index ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <Image
              src={urlFor(img).url()}
              width={80}
              height={80}
              alt={`Фото ${index + 1}`}
              className="rounded-md object-cover"
            />
          </button>
        ))}
      </div>

      <div
        className="border p-4 rounded-lg shadow-lg cursor-pointer max-h-[80vh] max-w-[900px] flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={urlFor(images[selectedIndex]).url()}
          alt="Вибране фото"
          width={900}
          height={900}
          className="rounded-lg object-contain max-h-[70vh] w-auto h-auto"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <button
            onClick={prevImage}
            className="absolute left-6 text-black text-4xl cursor-pointer z-50"
          >
            ⬅
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={urlFor(images[selectedIndex]).url()}
              alt="Відкрите фото"
              width={1000}
              height={1000}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 text-black text-4xl cursor-pointer z-50"
          >
            ➡
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-black text-4xl cursor-pointer z-50"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
