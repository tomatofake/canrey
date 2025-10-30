'use client';
import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CatalogItem from '../CatalogItem/CatalogItem';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { href: '/ovens',          title: 'Плити',               src: '/assets/images/ovens.jpg' },
  { href: '/gas-convectors', title: 'Газові конвектори',   src: '/assets/images/convectors.jpg' },
  { href: '/e-ovens',        title: 'Електричні духовки',  src: '/assets/images/eovens.jpg' },
];

const MOBILE_MAX = 1080;
const LEFT_SPACER = 24;

export default function Catalog() {
  const containerRef = useRef(null);
  const trackRef     = useRef(null);

  const [idx, setIdx] = useState(0);
  const [dims, setDims] = useState({
    vw: 0,
    itemW: 0,
    gap: 16,
    isMobile: false,
    maxOffset: 0,
  });

  useLayoutEffect(() => {
    const isMob = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
    setDims(d => ({ ...d, isMobile: isMob }));
    if (trackRef.current) {
      trackRef.current.style.willChange = 'transform';
      trackRef.current.style.transform = 'translate3d(0,0,0)';
      trackRef.current.style.transition = 'none';
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const onChange = () => {
      const isMob = mql.matches;
      setDims(d => ({ ...d, isMobile: isMob }));
      if (!isMob && trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform  = 'none';
        if (idx !== 0) setIdx(0);
      } else if (isMob && trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform  = 'translate3d(0,0,0)';
      }
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [idx]);

  const recalc = () => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;
    const itemW = Math.min(620, Math.max(260, Math.round(vw * 0.88)));
    const gap = 16;

    const contentWidth = LEFT_SPACER + slides.length * (itemW + gap) - gap;
    const maxOffset = Math.max(0, contentWidth - vw);

    setDims(d => ({ ...d, vw, itemW, gap, maxOffset }));
    requestAnimationFrame(() => slideTo(idx, { animate: false }));
  };

  useEffect(() => {
    if (containerRef.current) containerRef.current.style.touchAction = 'pan-y';

    if (dims.isMobile) {
      recalc();
      const onResize = () => recalc();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    } else {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform  = 'none';
      }
      if (idx !== 0) setIdx(0);
    }
  }, [dims.isMobile]);

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

  const slideTo = (to, { animate = true } = {}) => {
    const n = clamp(to, 0, slides.length - 1);
    setIdx(n);
    if (!trackRef.current || !dims.isMobile) return;

    const { itemW, gap, maxOffset } = dims;
    const baseOffset = LEFT_SPACER + n * (itemW + gap);
    const targetOffset = Math.min(baseOffset, maxOffset);
    const x = -targetOffset;

    trackRef.current.style.transition = animate
      ? 'transform 420ms cubic-bezier(.2,.8,.2,1)'
      : 'none';
    trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
  };

  useEffect(() => {
    if (!dims.isMobile || !containerRef.current || !trackRef.current) return;

    let startX = 0;
    let delta  = 0;
    let dragging = false;

    const area = containerRef.current;

    const onDown = (e) => {
      dragging = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      delta = 0;
      trackRef.current.style.transition = 'none';
      if ('pointerId' in e && area.setPointerCapture) {
        try { area.setPointerCapture(e.pointerId); } catch {}
      }
    };

    const onMove = (e) => {
      if (!dragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      delta = x - startX;

      const { itemW, gap, maxOffset } = dims;
      const base = LEFT_SPACER + idx * (itemW + gap);
      let currentOffset = base - delta;
      currentOffset = Math.max(0, Math.min(currentOffset, maxOffset));
      trackRef.current.style.transform = `translate3d(${-currentOffset}px,0,0)`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const threshold = 50;
      if (delta <= -threshold) slideTo(idx + 1);
      else if (delta >= threshold) slideTo(idx - 1);
      else slideTo(idx, { animate: true });
    };

    area.addEventListener('pointerdown', onDown, { passive: true });
    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerup', onUp,   { passive: true });
    area.addEventListener('pointercancel', onUp, { passive: true });
    area.addEventListener('pointerleave', onUp,  { passive: true });

    area.addEventListener('touchstart', onDown, { passive: true });
    area.addEventListener('touchmove',  onMove, { passive: true });
    area.addEventListener('touchend',   onUp,   { passive: true });
    area.addEventListener('touchcancel',onUp,   { passive: true });

    return () => {
      area.removeEventListener('pointerdown', onDown);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerup', onUp);
      area.removeEventListener('pointercancel', onUp);
      area.removeEventListener('pointerleave', onUp);

      area.removeEventListener('touchstart', onDown);
      area.removeEventListener('touchmove', onMove);
      area.removeEventListener('touchend', onUp);
      area.removeEventListener('touchcancel', onUp);
    };
  }, [dims.isMobile, dims.itemW, dims.maxOffset, idx]);

  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1081px)', () => {
      const animateFrom = (el, x = 0, y = 0) => {
        gsap.fromTo(
          el,
          { opacity: 0, x, y },
          {
            opacity: 1, x: 0, y: 0,
            duration: 1.1, ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'top 80%' }
          }
        );
      };
      animateFrom(leftRef.current,  -120, 0);
      animateFrom(centerRef.current,   0,  120);
      animateFrom(rightRef.current, 120,  0);
    });
    return () => mm.revert();
  }, []);

  const Arrow = ({ dir, onClick, hidden }) => (
    <button
      onClick={onClick}
      aria-hidden={hidden}
      aria-label={dir === 'left' ? 'Назад' : 'Далі'}
      className={`
        ${dims.isMobile ? 'block' : 'hidden'}
        absolute z-20 top-1/2 -translate-y-1/2
        h-11 w-11 rounded-full
        bg-black/45 backdrop-blur-sm
        grid place-items-center
        shadow-sm transition
        hover:bg-black/60 active:scale-95
        ${dir === 'left' ? 'left-2' : 'right-2'}
        ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2">
        {dir === 'left' ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );

  const itemStyle = useMemo(
    () => (dims.isMobile ? { width: `${dims.itemW}px` } : undefined),
    [dims.isMobile, dims.itemW]
  );
  const cardWrapClass = dims.isMobile
    ? 'shrink-0'
    : 'shrink basis-[clamp(360px,34vw,720px)] max-w-[720px]';

  return (
    <section className="flex flex-col mx-3 lg:mx-10 my-[60px] lg:my-[120px]">
      <div className="text-center text-primary text-5xl font-bold mt-2 mb-10">
        <h2>Каталог</h2>
      </div>

      <div
        ref={containerRef}
        className="
          relative
          overflow-hidden
          min-w-0 min-h-0
        "
      >
        <Arrow dir="left"  onClick={() => slideTo(idx - 1)} hidden={!dims.isMobile || idx === 0} />
        <Arrow dir="right" onClick={() => slideTo(idx + 1)} hidden={!dims.isMobile || idx === slides.length - 1} />

        <div
          ref={trackRef}
          className={`
            flex items-stretch
            ${dims.isMobile ? 'gap-4 justify-start' : 'gap-8 justify-center'}
            will-change-transform
            min-w-0 min-h-0
          `}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {dims.isMobile && <div style={{ width: LEFT_SPACER, flex: '0 0 auto' }} />}
          <div ref={leftRef}   className={cardWrapClass} style={itemStyle}>
            <Link href={slides[0].href}><CatalogItem title={slides[0].title} src={slides[0].src} /></Link>
          </div>
          <div ref={centerRef} className={cardWrapClass} style={itemStyle}>
            <Link href={slides[1].href}><CatalogItem title={slides[1].title} src={slides[1].src} /></Link>
          </div>
          <div ref={rightRef}  className={cardWrapClass} style={itemStyle}>
            <Link href={slides[2].href}><CatalogItem title={slides[2].title} src={slides[2].src} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}