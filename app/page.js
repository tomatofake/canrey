'use client';

import { useEffect, useRef } from 'react';
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
  const mainInnerRef   = useRef(null);
  const footerInnerRef = useRef(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.ticker.lagSmoothing(500, 16);
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });

    const ctx = gsap.context(() => {
      const setHeroY   = gsap.quickSetter(heroInnerRef.current, 'yPercent');
      const setHeroSc  = gsap.quickSetter(heroInnerRef.current, 'scale');
      const setMainY   = gsap.quickSetter(mainInnerRef.current, 'y');
      const setFooterY = gsap.quickSetter(footerInnerRef.current, 'y');

      gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], {
        force3D: true,
        willChange: 'transform'
      });

      gsap.set(heroInnerRef.current, { yPercent: 0, scale: 1 });

      ScrollTrigger.create({
        trigger: '#hero-wrapper',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress;
          setHeroY(gsap.utils.interpolate(0, -3, p));
          setHeroSc(gsap.utils.interpolate(1, 0.996, p));
        }
      });

      const ENTER_MAIN = -140;
      gsap.set(mainInnerRef.current, { y: ENTER_MAIN });

      ScrollTrigger.create({
        trigger: '#main-wrapper',
        start: 'top bottom',
        end: 'top top',
        scrub: 0.2,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress;
          setMainY(gsap.utils.interpolate(ENTER_MAIN, 0, p));
        }
      });

      const ENTER_FOOTER = 120;
      gsap.set(footerInnerRef.current, { y: ENTER_FOOTER });

      ScrollTrigger.create({
        trigger: '#footer-wrapper',
        start: 'top bottom',
        end: 'top top',
        scrub: 0.2,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress;
          setFooterY(gsap.utils.interpolate(ENTER_FOOTER, 0, p));
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />

      <main className="bg-[#171718]">
        <section id="hero-wrapper" className="relative bg-[#171718]">
          <div className="h-[100dvh] min-h-[100svh]">
            <div className="sticky top-0 h-[100dvh] min-h-[100svh] z-10 overflow-hidden">
              <div className="relative h-full">
                <div ref={heroInnerRef} className="h-full">
                  <Hero />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="main-wrapper" className="relative z-[5] bg-[#171718]">
          <div ref={mainInnerRef}>
            <Catalog />
            <Features />
          </div>
        </section>
      </main>

      <section id="footer-wrapper" className="relative z-0 bg-[#171718]">
        <div ref={footerInnerRef}>
          <Footer />
        </div>
      </section>
    </>
  );
}