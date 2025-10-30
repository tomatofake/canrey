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
  const scrollYRef = useRef(0);
  const bodyPrev = useRef(null);

  // 1) Даём React смонтировать портал
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2) Когда портал и overlayRef готовы — блокируем body и запускаем анимации
  useEffect(() => {
    if (!mounted || !overlayRef.current) return;

    scrollYRef.current = window.scrollY || 0;
    const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const b = document.body;

    bodyPrev.current = {
      position: b.style.position,
      top: b.style.top,
      left: b.style.left,
      right: b.style.right,
      width: b.style.width,
    };

    b.style.position = 'fixed';
    b.style.top = `-${scrollYRef.current}px`;
    b.style.left = '0';
    b.style.right = `${sbw}px`;
    b.style.width = '';

    const el = overlayRef.current;
    const items = el.querySelectorAll('.catalog-item');
    const bgs = el.querySelectorAll('.catalog-bg');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(el, { opacity: 0, y: '-8%', scale: 0.97 }, { opacity: 1, y: '0%', scale: 1, duration: 0.7 });
    tl.fromTo(bgs, { scale: 1.06, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.4');
    tl.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, '-=0.55');

    const onEsc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onEsc);

    const onResize = () => {
      const w = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      b.style.right = `${w}px`;
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', onResize);

      if (bodyPrev.current) {
        b.style.position = bodyPrev.current.position;
        b.style.top = bodyPrev.current.top;
        b.style.left = bodyPrev.current.left;
        b.style.right = bodyPrev.current.right;
        b.style.width = bodyPrev.current.width;
      }
      window.scrollTo(0, scrollYRef.current);
    };
  }, [mounted]);

  const handleClose = () => {
    const el = overlayRef.current;
    if (!el) return onClose?.();
    const items = el.querySelectorAll('.catalog-item');
    const bgs = el.querySelectorAll('.catalog-bg');

    gsap
      .timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => onClose?.() })
      .to(items, { y: -25, opacity: 0, duration: 0.35, stagger: 0.05 }, 0)
      .to(bgs, { scale: 1.04, opacity: 0.75, duration: 0.4 }, 0)
      .to(el, { opacity: 0, y: '-6%', scale: 0.97, duration: 0.5 }, '-=0.3');
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col min-h-[100svh]"
      aria-modal="true"
      role="dialog"
    >
      <div className="z-40 flex items-center justify-center h-16 xlg:h-20 px-4 pt-[env(safe-area-inset-top)] pointer-events-none">
        <h1 className="text-3xl xlg:text-5xl font-bold text-center tracking-tight">Каталог</h1>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-3 xlg:top-4 right-4 xlg:right-6 text-3xl xlg:text-4xl text-white z-50 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 hover:rotate-90"
        aria-label="Закрити каталог"
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
            <div className="absolute inset-0 -z-10 transform-gpu transition-transform duration-700 catalog-bg">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                priority
                className="object-cover brightness-[35%] group-hover:brightness-[55%] group-hover:scale-[1.04] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              />
            </div>

            <div className="catalog-item absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500">
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