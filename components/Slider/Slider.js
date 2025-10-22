'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { getSlider } from '@/app/lib/getSlider';
import { urlFor } from '@/app/lib/sanity';
import { gsap } from 'gsap';
import { useDrag } from '@use-gesture/react';

const Slider = () => {
  const [slider, setSlider] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRefs = useRef([]);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    getSlider().then((data) => setSlider(data));
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => nextSlide(), 5000);
  };
  const stopAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  const nextSlide = () => {
    if (!slider?.slides?.length) return;
    const next = currentIndex === slider.slides.length - 1 ? 0 : currentIndex + 1;
    animateSlide(next, 1);
    setCurrentIndex(next);
  };
  const prevSlide = () => {
    if (!slider?.slides?.length) return;
    const prev = currentIndex === 0 ? slider.slides.length - 1 : currentIndex - 1;
    animateSlide(prev, -1);
    setCurrentIndex(prev);
  };

  const animateSlide = (index, direction = 1) => {
    if (!slider?.slides?.length) return;
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const isActive = i === index;
      gsap.to(slide.querySelector('.image'), {
        scale: isActive ? 1 : 1.02,
        x: isActive ? 0 : 30 * direction,
        duration: 1.5,
        ease: 'power2.out'
      });
      gsap.to(slide.querySelector('.overlay'), {
        x: isActive ? 0 : -300 * direction,
        opacity: isActive ? 0.45 : 0.55,
        duration: 1.2
      });
      gsap.to(slide.querySelector('.text'), {
        autoAlpha: isActive ? 1 : 0,
        y: isActive ? 0 : -30 * direction,
        x: isActive ? 0 : 1000 * direction,
        duration: 1.2,
        ease: 'power3.out'
      });
      gsap.to(slide, {
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 2 : 1,
        duration: 1.2,
        ease: 'power2.out'
      });
    });
  };

  useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === -1) nextSlide();
      if (swipeX === 1) prevSlide();
      startAutoSlide();
    },
    { target: containerRef, swipe: { distance: 50 }, pointer: { touch: true } }
  );

  useEffect(() => {
    if (!slider?.slides?.length) return;

    slideRefs.current.forEach((slide, idx) => {
      if (!slide) return;
      gsap.set(slide, { opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 2 : 1 });
      gsap.set(slide.querySelector('.image'), { scale: 1.02, x: 0 });
      gsap.set(slide.querySelector('.overlay'), { opacity: idx === 0 ? 0.22 : 0.35 });
      gsap.set(slide.querySelector('.text'), { autoAlpha: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 50 });
    });

    gsap.from(containerRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.out' });

    startAutoSlide();
  }, [slider]);

  return (
    <div ref={containerRef} className="w-full h-[100vh] relative overflow-hidden bg-black">
      {slider?.slides?.map((slide, idx) => {
        const imageUrl = slide?.image ? urlFor(slide.image).url() : null;
        if (!imageUrl) return null;

        return (
          <div
            key={idx}
            ref={(el) => (slideRefs.current[idx] = el)}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <Image
              src={imageUrl}
              alt={slide.title || `Slide ${idx + 1}`}
              fill
              className="image object-cover"
              priority={idx === 0}
            />
            <div className="overlay absolute top-0 left-0 w-full h-full bg-black"></div>
            <div className="text absolute text-white text-center px-4 max-w-xl">
              <h2 className="text-4xl md:text-6xl font-bold">Комфорт на вашій кухні</h2>
              {slide.subtitle && <p className="mt-4 text-lg md:text-2xl">{slide.subtitle}</p>}
            </div>
          </div>
        );
      })}

      <button
        onClick={() => { prevSlide(); startAutoSlide(); }}
        className="absolute z-10 left-5 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition"
      >
        ‹
      </button>
      <button
        onClick={() => { nextSlide(); startAutoSlide(); }}
        className="absolute z-10 right-5 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition"
      >
        ›
      </button>
    </div>
  );
};

export default Slider;

