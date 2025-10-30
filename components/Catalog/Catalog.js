'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import CatalogItem from '../CatalogItem/CatalogItem';

const slides = [
  { href: '/ovens',          title: 'Плити',              src: '/assets/images/ovens.jpg' },
  { href: '/gas-convectors', title: 'Газові конвектори',  src: '/assets/images/convectors.jpg' },
  { href: '/e-ovens',        title: 'Електричні духовки', src: '/assets/images/eovens.jpg' },
];

const MOBILE_MAX = 1080;
const GAP = 16;
const LEFT_PAD = 24;

export default function Catalog() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [idx, setIdx] = useState(0);
  const [itemW, setItemW] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const recalc = () => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;
    setItemW(Math.min(620, Math.max(260, Math.round(vw * 0.88))));
    requestAnimationFrame(() => translateTo(idx, false));
  };

  useEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.touchAction = 'pan-y';
  }, []);

  const translateTo = (to, animate = true) => {
    if (!trackRef.current) return;
    const n = Math.max(0, Math.min(to, slides.length - 1));
    setIdx(n);
    const x = -(n * (itemW + GAP));
    trackRef.current.style.transition = animate ? 'transform 420ms cubic-bezier(.2,.8,.2,1)' : 'none';
    trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
  };

  useEffect(() => {
    if (!isMobile || !containerRef.current || !trackRef.current) return;

    let startX = 0;
    let delta = 0;
    let dragging = false;

    const area = containerRef.current;

    const onDown = e => {
      dragging = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      delta = 0;
      trackRef.current.style.transition = 'none';
    };

    const onMove = e => {
      if (!dragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      delta = x - startX;
      const base = -(idx * (itemW + GAP));
      const cur = base + delta;
      trackRef.current.style.transform = `translate3d(${cur}px,0,0)`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const threshold = 50;
      if (delta <= -threshold) translateTo(idx + 1, true);
      else if (delta >= threshold) translateTo(idx - 1, true);
      else translateTo(idx, true);
    };

    area.addEventListener('pointerdown', onDown, { passive: true });
    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerup', onUp, { passive: true });
    area.addEventListener('pointercancel', onUp, { passive: true });
    area.addEventListener('touchstart', onDown, { passive: true });
    area.addEventListener('touchmove', onMove, { passive: true });
    area.addEventListener('touchend', onUp, { passive: true });
    area.addEventListener('touchcancel', onUp, { passive: true });

    return () => {
      area.removeEventListener('pointerdown', onDown);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerup', onUp);
      area.removeEventListener('pointercancel', onUp);
      area.removeEventListener('touchstart', onDown);
      area.removeEventListener('touchmove', onMove);
      area.removeEventListener('touchend', onUp);
      area.removeEventListener('touchcancel', onUp);
    };
  }, [isMobile, itemW, idx]);

  useEffect(() => {
    if (!isMobile && trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = 'translate3d(0,0,0)';
      if (idx !== 0) setIdx(0);
    }
  }, [isMobile]);

  const itemStyle = useMemo(
    () => (isMobile ? { width: `${itemW}px`, flex: '0 0 auto' } : undefined),
    [isMobile, itemW]
  );
  const cardWrapClass = isMobile ? 'shrink-0' : 'shrink basis-[clamp(360px,34vw,720px)] max-w-[720px]';

  const Arrow = ({ dir, disabled }) => (
    <button
      onClick={() => translateTo(idx + (dir === 'left' ? -1 : 1), true)}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Назад' : 'Далі'}
      className={`
        ${isMobile ? 'block' : 'hidden'}
        absolute z-20 top-1/2 -translate-y-1/2
        h-11 w-11 rounded-full
        bg-black/45 backdrop-blur-sm
        grid place-items-center
        shadow-sm transition
        hover:bg-black/60 active:scale-95
        ${dir === 'left' ? 'left-2' : 'right-2'}
        ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2">
        {dir === 'left' ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );

  return (
    <section className="flex flex-col mx-3 lg:mx-10 my-[60px] lg:my-[120px]">
      <div className="text-center text-primary text-5xl font-bold mt-2 mb-10">
        <h2>Каталог</h2>
      </div>

      <div className="relative">
        <Arrow dir="left" disabled={!isMobile || idx === 0} />
        <Arrow dir="right" disabled={!isMobile || idx === slides.length - 1} />

        <div
          ref={containerRef}
          className={`${isMobile ? 'overflow-hidden pl-6' : 'overflow-hidden pl-0'} min-w-0`}
        >
          <div
            ref={trackRef}
            className={`flex items-stretch ${isMobile ? 'gap-4 justify-start' : 'gap-8 justify-center'} will-change-transform transform-gpu`}
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className={cardWrapClass} style={itemStyle}>
              <Link href={slides[0].href}><CatalogItem title={slides[0].title} src={slides[0].src} /></Link>
            </div>
            <div className={cardWrapClass} style={itemStyle}>
              <Link href={slides[1].href}><CatalogItem title={slides[1].title} src={slides[1].src} /></Link>
            </div>
            <div className={cardWrapClass} style={itemStyle}>
              <Link href={slides[2].href}><CatalogItem title={slides[2].title} src={slides[2].src} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}