'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';

const categories = [
  { title: 'Плити', image: '/assets/images/ovens.jpg',        link: '/ovens' },
  { title: 'Газові конвектори', image: '/assets/images/convectors.jpg', link: '/gas-convectors' },
  { title: 'Електричні духовки', image: '/assets/images/eovens.jpg',     link: '/e-ovens' },
];

const CatalogOverlay = ({ onClose }) => {
  const overlayRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    scrollYRef.current = window.scrollY || 0;
    const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const body = document.body;
    const prev = {
      position: body.style.position,
      top:      body.style.top,
      left:     body.style.left,
      right:    body.style.right,
      width:    body.style.width,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = `${sbw}px`;
    body.style.width = '';

    const cancel = (e) => e.preventDefault();
    const cancelKeys = (e) => {
      if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) e.preventDefault();
    };
    window.addEventListener('wheel', cancel, { passive: false });
    window.addEventListener('touchmove', cancel, { passive: false });
    window.addEventListener('keydown', cancelKeys);

    const overlayEl = overlayRef.current;
    const items = overlayEl.querySelectorAll('.catalog-item');
    const bgs   = overlayEl.querySelectorAll('.catalog-bg');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(overlayEl, { opacity: 0, y: '-8%', scale: 0.97 }, { opacity: 1, y: '0%', scale: 1, duration: 0.7 });
    tl.fromTo(bgs,       { scale: 1.06, opacity: 0.8 },         { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08 }, '-=0.4');
    tl.fromTo(items,     { y: 40, opacity: 0 },                 { y: 0, opacity: 1, duration: 0.25 }, '-=0.55');

    const onEsc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onEsc);

    const onResize = () => {
      const w = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      body.style.right = `${w}px`;
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
      window.removeEventListener('keydown', cancelKeys);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', onResize);

      body.style.position = prev.position;
      body.style.top      = prev.top;
      body.style.left     = prev.left;
      body.style.right    = prev.right;
      body.style.width    = prev.width;

      window.scrollTo(0, scrollYRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    const overlayEl = overlayRef.current;
    if (!overlayEl) return onClose?.();

    const items = overlayEl.querySelectorAll('.catalog-item');
    const bgs   = overlayEl.querySelectorAll('.catalog-bg');

    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => onClose?.(),
    })
      .to(items,     { y: -25, opacity: 0, duration: 0.35, stagger: 0.05 }, 0)
      .to(bgs,       { scale: 1.04, opacity: 0.75, duration: 0.4 },           0)
      .to(overlayEl, { opacity: 0, y: '-6%', scale: 0.97, duration: 0.5 },    '-=0.3');
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col min-h-[100svh]"
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
        {categories.map((cat, idx) => (
          <Link
            key={idx}
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

            <div className="catalog-item absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
              <h2 className="text-2xl xlg:text-4xl font-semibold text-center group-hover:scale-105 transition-transform duration-400">
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