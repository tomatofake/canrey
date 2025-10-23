'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';

const categories = [
  { title: 'Плити', image: '/assets/images/ovens.jpg', link: '/ovens' },
  { title: 'Газові конвектори', image: '/assets/images/convectors.jpg', link: '/gas-convectors' },
  { title: 'Електричні духовки', image: '/assets/images/eovens.jpg', link: '/e-ovens' },
];

const CatalogOverlay = ({ onClose }) => {
  const overlayRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    scrollYRef.current = window.scrollY || 0;

    // lock body
    const body = document.body;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollBarWidth}px`;
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.willChange = 'padding-right';

    const overlayEl = overlayRef.current;
    const items = overlayEl.querySelectorAll('.catalog-item');
    const bgs = overlayEl.querySelectorAll('.catalog-bg');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(overlayEl, { opacity: 0, y: '-8%', scale: 0.97 }, { opacity: 1, y: '0%', scale: 1, duration: 0.7 });
    tl.fromTo(bgs, { scale: 1.06, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.4');
    tl.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, '-=0.55');

    const handleEsc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    const overlayEl = overlayRef.current;
    if (!overlayEl) return onClose?.();

    const items = overlayEl.querySelectorAll('.catalog-item');
    const bgs = overlayEl.querySelectorAll('.catalog-bg');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        gsap.to(document.body, {
          paddingRight: 0,
          duration: 0.1,
          ease: 'power1.out',
          onComplete: () => {
            const b = document.body.style;
            b.position = '';
            b.top = '';
            b.left = '';
            b.right = '';
            b.width = '';
            b.overflow = '';
            b.willChange = '';
            window.scrollTo(0, scrollYRef.current);
            onClose?.();
          },
        });
      },
    });

    tl.to(items, { y: -25, opacity: 0, duration: 0.35, stagger: 0.05 }, 0);
    tl.to(bgs, { scale: 1.04, opacity: 0.75, duration: 0.4 }, 0);
    tl.to(overlayEl, { opacity: 0, y: '-6%', scale: 0.97, duration: 0.5 }, '-=0.3');
  };

  return (
    <div
      ref={overlayRef}
      className="
        fixed inset-0 z-[200] bg-black text-white flex flex-col
        min-h-[100svh]  /* враховує док і статус-бар */
      "
      aria-modal="true"
      role="dialog"
    >

      <div
        className="
          z-40 flex items-center justify-center
          h-16 md:h-20 px-4
          pt-[env(safe-area-inset-top)]
          pointer-events-none
        "
      >
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight">Каталог</h1>
      </div>

      <button
        onClick={handleClose}
        className="
          absolute top-3 md:top-4 right-4 md:right-6
          text-3xl md:text-4xl text-white z-50 p-2 rounded-full
          bg-black/30 hover:bg-black/50 transition-all duration-300 hover:rotate-90
        "
        aria-label="Закрити каталог"
      >
        <IoClose />
      </button>

      <div
        className="
          flex-1 w-full
          flex flex-col lg:flex-row
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            onClick={handleClose}
            className="
              relative group overflow-hidden
              flex items-center justify-center
              flex-1
              transition-all duration-700
            "
          >
            <div className="absolute inset-0 -z-10 transform-gpu transition-transform duration-700 catalog-bg">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                priority
                className="
                  object-cover
                  brightness-[35%]
                  group-hover:brightness-[55%]
                  group-hover:scale-[1.04]
                  transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                "
              />
            </div>

            <div className="catalog-item absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
              <h2 className="text-2xl md:text-4xl font-semibold text-center group-hover:scale-105 transition-transform duration-400">
                {cat.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CatalogOverlay;