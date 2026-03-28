'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { urlFor } from '@/app/lib/sanity';
import Image from 'next/image';

const ProductGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Новое состояние для мягкой анимации
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Единая функция для смены фото с мягким эффектом
  const handleImageChange = useCallback((updater) => {
    setAnimating(true); // Запускаем состояние сжатия/полупрозрачности
    setSelectedIndex(updater); // Моментально меняем индекс картинки
    
    // Даем браузеру 30 мс, чтобы применить начальные стили, 
    // а затем плавно возвращаем картинку в нормальное состояние
    setTimeout(() => {
      setAnimating(false);
    }, 30);
  }, []);

  const nextImage = useCallback(() => {
    handleImageChange((prev) => (prev + 1) % images.length);
  }, [handleImageChange, images.length]);

  const prevImage = useCallback(() => {
    handleImageChange((prev) => (prev - 1 + images.length) % images.length);
  }, [handleImageChange, images.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, isModalOpen]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);

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
      {/* Миниатюры (десктоп) */}
      <div className="hidden xl:flex xl:flex-col gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            className={`border-2 rounded-md transition ${
              selectedIndex === index ? 'border-blue-500' : 'border-gray-300'
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

      {/* Главное фото на странице */}
      <div
        className="rounded-lg cursor-pointer max-h-[80vh] max-w-[900px] flex items-center justify-center w-full overflow-hidden"
        onClick={() => setIsModalOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={urlFor(images[selectedIndex]).url()}
          alt="Вибране фото"
          width={900}
          height={900}
          // Добавили мягкий эффект перехода (opacity-70 и scale-95 -> opacity-100 и scale-100)
          className={`rounded-lg object-contain max-h-[70vh] w-auto h-auto transition-all duration-300 ease-out ${
            animating ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        />
      </div>

      {/* Миниатюры (мобилка) */}
      <div className="hidden sm:flex xl:hidden justify-between gap-1 mt-4 w-full flex-wrap">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            className={`border-2 p-1 rounded-md transition ${
              selectedIndex === index ? 'border-blue-500' : 'border-gray-300'
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

      {/* Модальное окно (полноэкранный режим) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          <button
            onClick={prevImage}
            aria-label="Назад"
            className="
              absolute z-20 top-1/2 -translate-y-1/2
              h-11 w-11 rounded-full
              bg-black/45 backdrop-blur-sm
              grid place-items-center
              shadow-sm transition
              hover:bg-black/60 active:scale-95
              left-4
            "
          >
            <svg viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='white' strokeWidth='2'>
              <path d='M15 19l-7-7 7-7' />
            </svg>
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
              // Тот же мягкий эффект для полноэкранного режима
              className={`object-contain max-h-full max-w-full transition-all duration-700 ease-out ${
                animating ? 'opacity-70' : 'opacity-100 scale-100'
              }`}
            />
          </div>

          <button
            onClick={nextImage}
            aria-label="Далі"
            className="
              absolute z-20 top-1/2 -translate-y-1/2
              h-11 w-11 rounded-full
              bg-black/45 backdrop-blur-sm
              grid place-items-center
              shadow-sm transition
              hover:bg-black/60 active:scale-95
              right-4
            "
          >
            <svg viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='white' strokeWidth='2'>
              <path d='M9 5l7 7-7 7' />
            </svg>
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            aria-label="Закрити"
            className="absolute top-6 right-6 text-black text-4xl cursor-pointer z-50 hover:opacity-70 transition"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;