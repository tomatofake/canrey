'use client'
import Slider from "../Slider/Slider"

/** Sticky находится в page.js, здесь только внутренняя обёртка для параллакса */
const Hero = ({ innerRef }) => {
  return (
    <section className="h-full w-full bg-black">
      <div ref={innerRef} className="h-full will-change-transform">
        <Slider />
      </div>
    </section>
  )
}

export default Hero
