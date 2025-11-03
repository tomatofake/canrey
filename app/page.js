'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Catalog from '@/components/Catalog/Catalog';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroInnerRef   = useRef(null);
  const heroTopMaskRef = useRef(null);
  const mainInnerRef   = useRef(null);
  const footerInnerRef = useRef(null);

  useLayoutEffect(() => {
    const isMobile = window.matchMedia('(max-width:1080px)').matches;

    if (!isMobile) {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        mm.add('(min-width:1081px)', () => {
          gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], {
            willChange: 'transform', force3D: true,
          });
          gsap.set(heroInnerRef.current, { yPercent: 0, scale: 1, opacity: 1 });
          gsap.set(heroTopMaskRef.current, { opacity: 0.06 });

          gsap.timeline({
            scrollTrigger: { trigger: '#hero-wrapper', start: 'top top', end: 'bottom top', scrub: true },
            defaults: { ease: 'none' },
          })
          .to(heroInnerRef.current, { yPercent: -3, scale: 0.995, opacity: 0.985 }, 0)
          .to(heroTopMaskRef.current, { opacity: 0.05 }, 0);

          gsap.set(mainInnerRef.current, { y: -240, opacity: 0.94 });
          gsap.timeline({
            scrollTrigger: { trigger: '#main-wrapper', start: 'top bottom', end: 'top top', scrub: true },
            defaults: { ease: 'none' },
          }).to(mainInnerRef.current, { y: 0, opacity: 1 }, 0);

          gsap.set(footerInnerRef.current, { y: 140, opacity: 0.96 });
          gsap.timeline({
            scrollTrigger: { trigger: '#footer-wrapper', start: 'top bottom', end: 'top top', scrub: true },
            defaults: { ease: 'none' },
          }).to(footerInnerRef.current, { y: 0, opacity: 1 }, 0);
        });
      });
      return () => { mm.revert(); ctx.revert(); };
    }

    // --------- MOBILE (без GSAP) ----------
    const heroEl   = heroInnerRef.current;
    const maskEl   = heroTopMaskRef.current;
    const mainEl   = mainInnerRef.current;
    const footerEl = footerInnerRef.current;

    // стартовые стили (дёшево и плавно)
    heroEl.style.willChange   = 'transform, opacity';
    mainEl.style.willChange   = 'transform, opacity';
    footerEl.style.willChange = 'transform, opacity';

    mainEl.style.transform   = 'translateY(-90px)';
    mainEl.style.opacity     = '0.985';
    footerEl.style.transform = 'translateY(90px)';
    footerEl.style.opacity   = '0.99';
    maskEl.style.opacity     = '0.06';

    let ticking = false;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    // вычисляем границы анимаций
    const bounds = {
      hero:   { start: 0, end: 0 },   // заполним ниже
      main:   { start: 0, end: 0 },
      footer: { start: 0, end: 0 },
    };

    const measure = () => {
      const vh = window.innerHeight;

      const heroWrap   = document.getElementById('hero-wrapper');
      const mainWrap   = document.getElementById('main-wrapper');
      const footerWrap = document.getElementById('footer-wrapper');

      const heroTop   = heroWrap.getBoundingClientRect().top + window.scrollY;
      const mainTop   = mainWrap.getBoundingClientRect().top + window.scrollY;
      const footerTop = footerWrap.getBoundingClientRect().top + window.scrollY;

      // такие же ощущения, как раньше, но без blur/scale
      bounds.hero.start   = heroTop;
      bounds.hero.end     = heroTop + vh;

      bounds.main.start   = mainTop - vh * 0.95;
      bounds.main.end     = mainTop - vh * 0.70;

      bounds.footer.start = footerTop - vh * 0.95;
      bounds.footer.end   = footerTop - vh * 0.72;
    };

    const applyHero = (y) => {
      const p = clamp01((y - bounds.hero.start) / (bounds.hero.end - bounds.hero.start || 1));
      const yPct = -1.2 * p;              // было -1.2%
      const op   = 1 - 0.01 * p;          // 1 → 0.99
      heroEl.style.transform = `translate3d(0,${yPct}%,0)`;
      heroEl.style.opacity   = String(op);
      maskEl.style.opacity   = String(0.06 - 0.005 * p);
    };

    const applyMain = (y) => {
      const p = clamp01((y - bounds.main.start) / (bounds.main.end - bounds.main.start || 1));
      const ty = -90 * (1 - p);
      const op = 0.985 + 0.015 * p;
      mainEl.style.transform = `translate3d(0,${ty}px,0)`;
      mainEl.style.opacity   = String(op);
    };

    const applyFooter = (y) => {
      const p = clamp01((y - bounds.footer.start) / (bounds.footer.end - bounds.footer.start || 1));
      const ty = 90 * (1 - p);
      const op = 0.99 + 0.01 * p;
      footerEl.style.transform = `translate3d(0,${ty}px,0)`;
      footerEl.style.opacity   = String(op);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        applyHero(y);
        applyMain(y);
        applyFooter(y);
        ticking = false;
      });
    };

    // стабильный рефреш размеров
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(document.documentElement);
    ro.observe(document.body);

    measure();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('orientationchange', measure, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('orientationchange', measure);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <Header />

      <main className="bg-[#171718]">
        <section id="hero-wrapper" className="relative">
          <div className="h-[100svh]">
            <div className="sticky top-0 h-[100svh] z-20 overflow-hidden">
              <div className="relative h-full">
                <div ref={heroInnerRef} className="h-full">
                  <Hero />
                </div>
                <div
                  ref={heroTopMaskRef}
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#171718] to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="main-wrapper" className="relative z-[10]">
          <div ref={mainInnerRef}>
            <Catalog />
            <Features />
          </div>
        </section>
      </main>

      <section id="footer-wrapper" className="relative z-0 -mt-px">
        <div ref={footerInnerRef}>
          <Footer />
        </div>
      </section>
    </>
  );
}