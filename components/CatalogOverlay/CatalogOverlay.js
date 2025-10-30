'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';

const categories = [
  { title: 'Плити',               image: '/assets/images/ovens.jpg',      link: '/ovens' },
  { title: 'Газові конвектори',   image: '/assets/images/convectors.jpg', link: '/gas-convectors' },
  { title: 'Електричні духовки',  image: '/assets/images/eovens.jpg',     link: '/e-ovens' },
];

export default function CatalogOverlay({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    const body = document.body;
    const sbw = Math.max(0, window.innerWidth - html.clientWidth);

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    const el = overlayRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, yPercent: -6, scale: 0.98 },
        { opacity: 1, yPercent: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }

    const onEsc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onEsc);

    return () => {
      window.removeEventListener('keydown', onEsc);
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleClose = () => {
    const el = overlayRef.current;
    if (!el) return onClose?.();
    gsap.to(el, {
      opacity: 0,
      yPercent: -4,
      scale: 0.985,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => onClose?.(),
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] bg-black text-white flex flex-col min-h-[100svh] overscroll-none touch-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="z-40 flex items-center justify-center h-16 xlg:h-20 px-4 pt-[env(safe-area-inset-top)] pointer-events-none">
        <h1 className="text-3xl xlg:text-5xl font-bold text-center tracking-tight">Каталог</h1>
      </div>

      <button
        onClick={handleClose}
        aria-label="Закрити каталог"
        className="absolute top-3 xlg:top-4 right-4 xlg:right-6 text-3xl xlg:text-4xl text-white z-50 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/55 transition"
      >
        <IoClose />
      </button>

      <div className="flex-1 w-full flex flex-col xlg:flex-row pb-[env(safe-area-inset-bottom)]">
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={cat.link}
            onClick={handleClose}
            className="relative group overflow-hidden flex items-center justify-center flex-1 transition-all duration-700"
          >
            <div className="absolute inset-0 -z-10 transform-gpu transition-transform duration-700">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                priority
                className="object-cover brightness-[35%] group-hover:brightness-[55%] group-hover:scale-[1.04] transition-all duration-500"
              />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <h2 className="text-2xl xlg:text-4xl font-semibold text-center group-hover:scale-105 transition-transform duration-400">
                {cat.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>,
    document.body
  );
}