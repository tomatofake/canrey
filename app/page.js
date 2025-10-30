'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Catalog from "@/components/Catalog/Catalog";
import Features from "@/components/Features/Features";
import Footer from "@/components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroInnerRef   = useRef(null);
  const mainInnerRef   = useRef(null);
  const footerInnerRef = useRef(null);
  const heroTopMaskRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.ticker.lagSmoothing(1000, 16);

    const ctx = gsap.context(() => {
      gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], { force3D: true, willChange: 'transform' });

      gsap.set(heroInnerRef.current, { yPercent: 0, scale: 1 });
      gsap.set(heroTopMaskRef.current, { opacity: 0.06 });

      gsap.timeline({
        scrollTrigger: { trigger: '#hero-wrapper', start: 'top top', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' }
      })
      .to(heroInnerRef.current, { yPercent: -2, scale: 0.998 }, 0)
      .to(heroTopMaskRef.current, { opacity: 0.05 }, 0);

      const ENTER_OFFSET_MAIN = -120;
      gsap.set(mainInnerRef.current, { y: ENTER_OFFSET_MAIN });

      gsap.timeline({
        scrollTrigger: { trigger: '#main-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      })
      .to(mainInnerRef.current, { y: 0 }, 0);

      const ENTER_OFFSET_FOOTER = 120;
      gsap.set(footerInnerRef.current, { y: ENTER_OFFSET_FOOTER });

      gsap.timeline({
        scrollTrigger: { trigger: '#footer-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      })
      .to(footerInnerRef.current, { y: 0 }, 0);
    });

    return () => ctx.revert();
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
                <div ref={heroTopMaskRef} className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#171718] to-transparent" />
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