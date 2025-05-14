'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { getSlider } from '@/app/lib/getSlider';
import { urlFor } from '@/app/lib/sanity';

const Slider = () => {
  const [slider, setSlider] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    getSlider().then(setSlider);
  }, []);

  useEffect(() => {
    if (slider?.slides?.length) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slider.slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(intervalRef.current);
    }
  }, [slider]);

  if (!slider || !slider.slides) return null;

  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-black">
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slider.slides.map((slide, idx) => {
          const imageUrl = slide?.image ? urlFor(slide.image).url() : null;
          const width = slide?.image?.asset?._ref?.split('-')[2]?.split('x')[0];
          const height = slide?.image?.asset?._ref?.split('-')[2]?.split('x')[1];
          const isPortrait = width && height ? +height > +width : false;

          if (!imageUrl) return null;

          return (
            <div
              key={idx}
              className="relative w-full h-screen flex-shrink-0 flex items-center justify-center"
            >
              <Image
                src={imageUrl}
                alt={`Слайд ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                className={isPortrait ? 'object-contain' : 'object-cover'}
                priority={idx === 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;

