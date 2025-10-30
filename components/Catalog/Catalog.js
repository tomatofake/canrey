'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import CatalogItem from '../CatalogItem/CatalogItem';

const slides = [
  { href: '/ovens',          title: 'Плити',               src: '/assets/images/ovens.jpg' },
  { href: '/gas-convectors', title: 'Газові конвектори',   src: '/assets/images/convectors.jpg' },
  { href: '/e-ovens',        title: 'Електричні духовки',  src: '/assets/images/eovens.jpg' },
];

const MOBILE_MAX = 1080;
const GAP = 16;
const LEFT_SPACER = 24;

export default function Catalog() {
  const containerRef = useRef(null);
  const spacerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [idx, setIdx] = useState(0);
  const [itemW, setItemW] = useState(0);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const recalc = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    setVw(w);
    const target = Math.min(620, Math.max(260, Math.round(w * 0.88)));
    setItemW(target);
  };

  useEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollToIndex = (to) => {
    if (!containerRef.current) return;
    const n = Math.max(0, Math.min(to, slides.length - 1));
    const spacer = isMobile ? LEFT_SPACER : 0;
    const left = spacer + n * (itemW + GAP);
    containerRef.current.scrollTo({ left, behavior: 'smooth' });
    setIdx(n);
  };

  useEffect(() => {
    if (!containerRef.current || !isMobile) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        const spacer = LEFT_SPACER;
        const pos = Math.max(0, el.scrollLeft - spacer);
        const step = itemW + GAP;
        const near = Math.round(pos / step);
        const clamped = Math.max(0, Math.min(near, slides.length - 1));
        if (clamped !== idx) setIdx(clamped);
      });
    };
    const el = containerRef.current;
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, itemW, idx]);

  const itemStyle = useMemo(
    () => (isMobile ? { width: `${itemW}px`, flex: '0 0 auto' } : undefined),
    [isMobile, itemW]
  );
  const cardWrapClass = isMobile
    ? 'shrink-0'
    : 'shrink basis-[clamp(360px,34vw,720px)] max-w-[720px]';

  const Arrow = ({ dir, disabled }) => (
    <button
      onClick={() => scrollToIndex(idx + (dir === 'left' ? -1 : 1))}
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
          className={`
            ${isMobile
              ? 'overflow-x-auto overflow-y-visible snap-x snap-mandatory'
              : 'overflow-hidden'}
            scrollbar-none
            min-w-0
          `}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div
            className={`
              flex items-stretch
              ${isMobile ? 'gap-4 justify-start' : 'gap-8 justify-center'}
              min-w-0
            `}
          >
            {isMobile && <div ref={spacerRef} style={{ width: LEFT_SPACER, flex: '0 0 auto' }} />}

            <div className={`${cardWrapClass} ${isMobile ? 'snap-start' : ''}`} style={itemStyle}>
              <Link href={slides[0].href}>
                <CatalogItem title={slides[0].title} src={slides[0].src} />
              </Link>
            </div>

            <div className={`${cardWrapClass} ${isMobile ? 'snap-start' : ''}`} style={itemStyle}>
              <Link href={slides[1].href}>
                <CatalogItem title={slides[1].title} src={slides[1].src} />
              </Link>
            </div>

            <div className={`${cardWrapClass} ${isMobile ? 'snap-start' : ''}`} style={itemStyle}>
              <Link href={slides[2].href}>
                <CatalogItem title={slides[2].title} src={slides[2].src} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}