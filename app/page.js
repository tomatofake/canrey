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
  const mainInnerRef   = useRef(null);
  const footerInnerRef = useRef(null);
  const heroTopMaskRef = useRef(null);

  useLayoutEffect(() => {
    ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.ticker.lagSmoothing(1000, 16);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        { mobile: '(max-width: 1080px)', desktop: '(min-width: 1081px)' },
        (m) => {
          const isMobile = !!m.conditions?.mobile;

          gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], {
            willChange: 'transform',
            force3D: true,
          });

          gsap.set(heroInnerRef.current, { yPercent: 0, opacity: 1 });
          gsap.set(heroTopMaskRef.current, { opacity: 0.06 });

          gsap.timeline({
            scrollTrigger: {
              trigger: '#hero-wrapper',
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.45 : 0.8,
              fastScrollEnd: true,
            },
            defaults: { ease: 'none' },
          })
          .to(
            heroInnerRef.current,
            isMobile
              ? { yPercent: -1.2, opacity: 0.99 }
              : { yPercent: -3, scale: 0.995, opacity: 0.985 },
            0
          )
          .to(heroTopMaskRef.current, { opacity: isMobile ? 0.055 : 0.05 }, 0);

          const enterYMain   = isMobile ? -90 : -240;
          const startMain    = isMobile ? 'top 95%' : 'top bottom';
          const endMain      = isMobile ? 'top 70%' : 'top top';
          const scrubMain    = isMobile ? 0.55 : 0.9;

          gsap.set(mainInnerRef.current, {
            y: enterYMain,
            opacity: isMobile ? 0.985 : 0.94,
          });

          gsap.timeline({
            scrollTrigger: {
              trigger: '#main-wrapper',
              start: startMain,
              end: endMain,
              scrub: scrubMain,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          })
          .to(mainInnerRef.current, { y: 0, opacity: 1 }, 0);

          const enterYFooter = isMobile ? 90 : 140;
          const startFooter  = isMobile ? 'top 95%' : 'top bottom';
          const endFooter    = isMobile ? 'top 72%' : 'top top';
          const scrubFooter  = isMobile ? 0.5 : 0.85;

          gsap.set(footerInnerRef.current, {
            y: enterYFooter,
            opacity: isMobile ? 0.99 : 0.96,
          });

          gsap.timeline({
            scrollTrigger: {
              trigger: '#footer-wrapper',
              start: startFooter,
              end: endFooter,
              scrub: scrubFooter,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          })
          .to(footerInnerRef.current, { y: 0, opacity: 1 }, 0);
        }
      );
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      mm.revert();
      ctx.revert();
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
