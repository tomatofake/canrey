"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";

const ProductGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const indexToRem = (index) => `${index * 1}rem`;

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

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (distance > threshold) nextImage();
    if (distance < -threshold) prevImage();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 justify-center sm:items-start items-center">
      <div className="hidden xl:flex xl:flex-col gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`border-2 rounded-md transition ${
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
        className="border rounded-lg shadow-lg cursor-pointer max-h-[80vh] max-w-[900px] flex items-center justify-center w-full overflow-hidden"
        onClick={() => setIsModalOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={urlFor(images[selectedIndex]).url()}
          alt="Вибране фото"
          width={900}
          height={900}
          className="rounded-lg object-contain max-h-[70vh] w-auto h-auto transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="hidden sm:flex xl:hidden justify-between gap-1 mt-4 w-full flex-wrap">
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

      <div className="flex sm:hidden justify-center gap-2 mt-4 relative h-3">
        {images.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-black opacity-30 transition-all duration-300 ease-in-out"
          />
        ))}
        <div
          className="w-3 h-3 rounded-full bg-black absolute top-[calc(50%-0.125rem)] left-0 transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(${indexToRem(selectedIndex)} - 0.125rem)) translateY(-50%)`,
          }}
        />
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <button
            onClick={prevImage}
            className="hidden xl:block absolute left-6 text-black text-4xl cursor-pointer z-50"
          >
            ⬅
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={urlFor(images[selectedIndex]).url()}
              alt="Відкрите фото"
              width={1000}
              height={1000}
              className="object-contain max-h-full max-w-full transition-all duration-300 ease-in-out"
            />
          </div>

          <button
            onClick={nextImage}
            className="hidden xl:block absolute right-6 text-black text-4xl cursor-pointer z-50"
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