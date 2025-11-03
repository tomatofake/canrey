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
  const heroInnerRef   = useRef<HTMLDivElement | null>(null);
  const mainInnerRef   = useRef<HTMLDivElement | null>(null);
  const footerInnerRef = useRef<HTMLDivElement | null>(null);
  const heroTopMaskRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.ticker.lagSmoothing(1000, 48);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          mobile: '(max-width: 1080px)',
          desktop: '(min-width: 1081px)',
        },
        (ctx) => {
          const { conditions } = ctx;
          const isMobile = !!conditions?.mobile;

          gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], {
            force3D: true,
            willChange: 'transform',
          });

          gsap.set(heroInnerRef.current, { yPercent: 0, opacity: 1 });
          gsap.set(heroTopMaskRef.current, { opacity: 0.06 });

          gsap.timeline({
            scrollTrigger: {
              trigger: '#hero-wrapper',
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.5 : true,
              fastScrollEnd: true,
            },
            defaults: { ease: 'none' },
          })
          .to(
            heroInnerRef.current,
            isMobile
              ? { yPercent: -1.2, opacity: 0.99 }
              : { yPercent: -3, scale: 0.995, filter: 'blur(0.3px)', opacity: 0.985 },
            0
          )
          .to(heroTopMaskRef.current, { opacity: isMobile ? 0.055 : 0.05 }, 0);

          const enterOffsetMain = isMobile ? -100 : -250;
          const startMain = isMobile ? 'top 96%' : 'top bottom';
          const endMain   = isMobile ? 'top 68%' : 'top top';

          gsap.set(mainInnerRef.current, isMobile
            ? { y: enterOffsetMain, opacity: 0.98 }
            : { y: enterOffsetMain, opacity: 0.94, filter: 'blur(0.3px)' }
          );

          gsap.timeline({
            scrollTrigger: {
              trigger: '#main-wrapper',
              start: startMain,
              end: endMain,
              scrub: isMobile ? 0.6 : true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          })
          .to(mainInnerRef.current, isMobile
            ? { y: 0, opacity: 1 }
            : { y: 0, opacity: 1, filter: 'blur(0px)' },
            0
          );

          const enterOffsetFooter = isMobile ? 100 : 140;
          const startFooter = isMobile ? 'top 96%' : 'top bottom';
          const endFooter   = isMobile ? 'top 70%' : 'top top';

          gsap.set(footerInnerRef.current, isMobile
            ? { y: enterOffsetFooter, opacity: 0.99 }
            : { y: enterOffsetFooter, opacity: 0.96, filter: 'blur(0.2px)' }
          );

          gsap.timeline({
            scrollTrigger: {
              trigger: '#footer-wrapper',
              start: startFooter,
              end: endFooter,
              scrub: isMobile ? 0.6 : true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          })
          .to(footerInnerRef.current, isMobile
            ? { y: 0, opacity: 1 }
            : { y: 0, opacity: 1, filter: 'blur(0px)' },
            0
          );
        }
      );
    });

    return () => {
      ctx.revert();
      mm.revert();
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