'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { getSlider } from '@/app/lib/getSlider';
import { gsap } from 'gsap';
import { useDrag } from '@use-gesture/react';

const Slider = () => {
  const [slider, setSlider] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const autoRef = useRef(null);

  useEffect(() => {
    getSlider().then((data) => setSlider(data));
  }, []);

  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => handleNext(), 7000);
  };
  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const handleNext = () => {
    if (!slider?.slides?.length) return;
    const next = (currentIndex + 1) % slider.slides.length;
    animateTransition(currentIndex, next, 'right');
    setCurrentIndex(next);
  };

  const handlePrev = () => {
    if (!slider?.slides?.length) return;
    const prev = (currentIndex - 1 + slider.slides.length) % slider.slides.length;
    animateTransition(currentIndex, prev, 'left');
    setCurrentIndex(prev);
  };

  const animateTransition = (from, to, direction) => {
    const current = slidesRef.current[from];
    const next = slidesRef.current[to];
    if (!current || !next) return;

    const offsetX = direction === 'right' ? 320 : -320;
    const currentImg = current.querySelector('.image');
    const nextImg = next.querySelector('.image');
    const currentText = current.querySelector('.text');
    const nextText = next.querySelector('.text');

    gsap.set(next, { zIndex: 3 });
    gsap.set(nextImg, {
      opacity: 0,
      scale: 1.08,
      x: offsetX,
      filter: 'blur(3px)',
    });
    gsap.set(nextText, { autoAlpha: 0, y: 25, filter: 'blur(0px)' });
    gsap.set(current, { zIndex: 2 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(currentImg, {
      opacity: 0.6,
      scale: 1.02,
      x: direction === 'right' ? -40 : 40,
      filter: 'blur(3px)',
      duration: 0.8,
    });

    tl.to(
      nextImg,
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.1,
      },
      '-=0.6'
    );

    if (currentText && nextText) {
      gsap.fromTo(
        currentText,
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.inOut' }
      );
      gsap.fromTo(
        nextText,
        { autoAlpha: 0, y: 35 },
        { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.1, ease: 'power2.out' }
      );
    }
  };

  useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === -1) handleNext();
      if (swipeX === 1) handlePrev();
      startAuto();
    },
    { target: containerRef, swipe: { distance: 50 }, pointer: { touch: true } }
  );

  useEffect(() => {
    if (!slider?.slides?.length) return;

    slidesRef.current.forEach((slide, i) => {
      const img = slide.querySelector('.image');
      const txt = slide.querySelector('.text');
      gsap.set(slide, { opacity: 1, zIndex: i === 0 ? 2 : 1 });
      gsap.set(img, {
        opacity: i === 0 ? 1 : 0,
        scale: 1,
        x: 0,
        filter: 'blur(0px)',
      });
      gsap.set(txt, {
        autoAlpha: i === 0 ? 1 : 0,
        y: 0,
        filter: 'blur(0px)',
      });
    });

    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    startAuto();
    return stopAuto;
  }, [slider]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100svh] overflow-hidden bg-black select-none touch-pan-y"
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

      {slider?.slides?.map((slide, idx) => {
        const img = slide?.image?.asset?.url;
        if (!img) return null;

        return (
          <div
            key={idx}
            ref={(el) => (slidesRef.current[idx] = el)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={img}
              alt={`Slide ${idx + 1}`}
              fill
              priority={idx === 0}
              className="image object-cover"
            />

            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            {slide.text && (
              <div className="text absolute text-center text-white px-6 max-w-3xl">
                <p className="text-3xl md:text-5xl font-semibold leading-snug drop-shadow-lg">
                  {slide.text}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={() => {
          handlePrev();
          startAuto();
        }}
        className="hidden sm:inline-flex absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-white/20 text-white text-4xl px-4 py-1 rounded-full hover:bg-white/40 transition"
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        onClick={() => {
          handleNext();
          startAuto();
        }}
        className="hidden sm:inline-flex absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-white/20 text-white text-4xl px-4 py-1 rounded-full hover:bg-white/40 transition"
        aria-label="Next Slide"
      >
        ›
      </button>
    </div>
  );
};

export default Slider;