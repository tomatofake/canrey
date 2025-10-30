'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CatalogItem from '../CatalogItem/CatalogItem';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { href: '/ovens',          title: 'Плити',              src: '/assets/images/ovens.jpg' },
  { href: '/gas-convectors', title: 'Газові конвектори',  src: '/assets/images/convectors.jpg' },
  { href: '/e-ovens',        title: 'Електричні духовки', src: '/assets/images/eovens.jpg' },
];

const MOBILE_MAX = 1080;

export default function Catalog() {
  const containerRef = useRef(null);
  const trackRef     = useRef(null);

  const [idx, setIdx] = useState(0);
  const [dims, setDims] = useState({
    vw: 0,
    itemW: 0,
    gap: 16,
    leftPad: 24,
    isMobile: false,
    maxOffset: 0,
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const apply = () => setDims(d => ({ ...d, isMobile: mql.matches }));
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const recalc = () => {
    if (!containerRef.current) return;
    const vw = containerRef.current.clientWidth;


    const itemW = Math.min(620, Math.max(260, Math.round(vw * 0.88)));
    const gap = 16;
    const leftPad = 24;
    const rightPad = 0;

    const contentWidth = leftPad + slides.length * (itemW + gap) - gap + rightPad;
    const maxOffset = Math.max(0, contentWidth - vw);

    setDims(d => ({ ...d, vw, itemW, gap, leftPad, maxOffset }));
    requestAnimationFrame(() => slideTo(idx, { animate: false }));
  };

  useEffect(() => {

    if (containerRef.current) {
      containerRef.current.style.touchAction = 'pan-y';
      containerRef.current.style.overscrollBehaviorX = 'contain';
    }

    if (dims.isMobile) {
      recalc();
      window.addEventListener('resize', recalc);
      return () => window.removeEventListener('resize', recalc);
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

    const { itemW, gap, leftPad, maxOffset } = dims;
    const baseOffset = leftPad + n * (itemW + gap);
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
    let startY = 0;
    let deltaX = 0;
    let dragging = false;
    let lockedAxis = null;
    let raf = null;

    const area = containerRef.current;

    const applyTransform = (px) => {
      if (!trackRef.current) return;
      trackRef.current.style.transform = `translate3d(${px}px,0,0)`;
    };

    const onDown = (e) => {
      dragging = true;
      lockedAxis = null;
      deltaX = 0;

      const p = 'touches' in e ? e.touches[0] : e;
      startX = p.clientX;
      startY = p.clientY;

      trackRef.current.style.transition = 'none';
      if ('pointerId' in e && area.setPointerCapture) {
        try { area.setPointerCapture(e.pointerId); } catch {}
      }
    };

    const onMove = (e) => {
      if (!dragging) return;
      const p = 'touches' in e ? e.touches[0] : e;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;

      if (!lockedAxis) {
        if (Math.abs(dx) > 12) lockedAxis = 'x';
        else if (Math.abs(dy) > 12) lockedAxis = 'y';
      }

      if (lockedAxis === 'x') {
        if (e.cancelable) e.preventDefault();
        deltaX = dx;

        const { itemW, gap, leftPad, maxOffset } = dims;
        const base = leftPad + idx * (itemW + gap);
        let currentOffset = base - deltaX;
        currentOffset = Math.max(0, Math.min(currentOffset, maxOffset));
        const x = -currentOffset;

        if (!raf) {
          raf = requestAnimationFrame(() => {
            applyTransform(x);
            raf = null;
          });
        }
      }
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      lockedAxis = null;

      const threshold = 50;
      if (deltaX <= -threshold) slideTo(idx + 1);
      else if (deltaX >= threshold) slideTo(idx - 1);
      else slideTo(idx, { animate: true });
    };

    area.addEventListener('pointerdown', onDown, { passive: true });
    area.addEventListener('pointermove', onMove, { passive: false });
    area.addEventListener('pointerup', onUp,   { passive: true });
    area.addEventListener('pointercancel', onUp, { passive: true });
    area.addEventListener('pointerleave', onUp,  { passive: true });

    area.addEventListener('touchstart', onDown, { passive: true });
    area.addEventListener('touchmove',  onMove, { passive: false });
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
      if (raf) cancelAnimationFrame(raf);
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
    <section className="flex flex-col mx-3 lg:mx-10 my-[60px] lg:my-[120px] select-none">
      <div className="text-center text-primary text-5xl font-bold mt-2 mb-10">
        <h2>Каталог</h2>
      </div>

      <div
        ref={containerRef}
        className={`
          relative overflow-hidden min-w-0 min-h-0
          ${dims.isMobile ? 'pl-6' : 'pl-0'}
        `}
      >
        <Arrow dir="left"  onClick={() => slideTo(idx - 1)} hidden={!dims.isMobile || idx === 0} />
        <Arrow dir="right" onClick={() => slideTo(idx + 1)} hidden={!dims.isMobile || idx === slides.length - 1} />

        <div
          ref={trackRef}
          className={`
            flex items-stretch will-change-transform min-w-0 min-h-0
            ${dims.isMobile ? 'gap-4 justify-start' : 'gap-8 justify-center'}
          `}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
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