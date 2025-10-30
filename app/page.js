'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Header from "@/components/Header/Header"
import Hero from "@/components/Hero/Hero"
import Catalog from "@/components/Catalog/Catalog"
import Features from "@/components/Features/Features"
import Footer from "@/components/Footer/Footer"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroInnerRef   = useRef(null)
  const mainInnerRef   = useRef(null)
  const footerInnerRef = useRef(null)
  const heroTopMaskRef = useRef(null)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    ScrollTrigger.config({ ignoreMobileResize: true })
    const mm = gsap.matchMedia()

    const ENTER_OFFSET_MAIN = -200
    const ENTER_OFFSET_FOOTER = 140

    const commonInit = () => {
      gsap.set([heroInnerRef.current, mainInnerRef.current, footerInnerRef.current], {
        force3D: true,
        willChange: 'transform'
      })
      gsap.set(heroTopMaskRef.current, { opacity: 0.06 })
    }

    mm.add('(hover: none) and (pointer: coarse)', () => {
      commonInit()

      gsap.timeline({
        scrollTrigger: { trigger: '#hero-wrapper', start: 'top top', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' }
      })
      .to(heroInnerRef.current, { yPercent: -3 }, 0)
      .to(heroTopMaskRef.current, { opacity: 0.05 }, 0)

      gsap.set(mainInnerRef.current, { y: ENTER_OFFSET_MAIN, opacity: 0.96 })
      gsap.timeline({
        scrollTrigger: { trigger: '#main-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      }).to(mainInnerRef.current, { y: 0, opacity: 1 }, 0)

      gsap.set(footerInnerRef.current, { y: ENTER_OFFSET_FOOTER, opacity: 0.97 })
      gsap.timeline({
        scrollTrigger: { trigger: '#footer-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      }).to(footerInnerRef.current, { y: 0, opacity: 1 }, 0)
    })

    mm.add('(hover: hover) and (pointer: fine)', () => {
      commonInit()

      gsap.timeline({
        scrollTrigger: { trigger: '#hero-wrapper', start: 'top top', end: 'bottom top', scrub: true },
        defaults: { ease: 'none' }
      })
      .to(heroInnerRef.current, {
        yPercent: -3,
        scale: 0.997,
        filter: 'blur(0.25px)',
        opacity: 0.988
      }, 0)
      .to(heroTopMaskRef.current, { opacity: 0.05 }, 0)

      gsap.set(mainInnerRef.current, { y: ENTER_OFFSET_MAIN, opacity: 0.96, filter: 'blur(0.2px)' })
      gsap.timeline({
        scrollTrigger: { trigger: '#main-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      }).to(mainInnerRef.current, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0)

      gsap.set(footerInnerRef.current, { y: ENTER_OFFSET_FOOTER, opacity: 0.97, filter: 'blur(0.2px)' })
      gsap.timeline({
        scrollTrigger: { trigger: '#footer-wrapper', start: 'top bottom', end: 'top top', scrub: true },
        defaults: { ease: 'none' }
      }).to(footerInnerRef.current, { y: 0, opacity: 1, filter: 'blur(0px)' }, 0)
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      <Header />

      <main className="bg-[#171718]">
        <section id="hero-wrapper" className="relative">
          <div className="h-viewport">
            <div className="sticky top-0 h-viewport z-20 overflow-hidden ios-sticky-open ios-composite">
              <div className="relative h-full">
                <div ref={heroInnerRef} className="h-full ios-composite ios-no-filter ios-no-scale">
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
          <div ref={mainInnerRef} className="ios-composite ios-no-filter">
            <Catalog />
            <Features />
          </div>
        </section>
      </main>

      <section id="footer-wrapper" className="relative z-0 -mt-px">
        <div ref={footerInnerRef} className="ios-composite ios-no-filter">
          <Footer />
        </div>
      </section>
    </>
  )
}