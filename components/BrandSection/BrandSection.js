"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BrandSection = ({ imageSrc, imageAlt, children, reverse = false }) => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: reverse ? -100 : 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "max-w-[1600px] mx-auto px-4 md:px-10 pb-20",
        "flex flex-col lg:flex-row items-center gap-20 text-center lg:text-left",
        reverse && "lg:flex-row-reverse"
      )}
    >
      {imageSrc && (
        <div
          ref={imageRef}
          className={clsx(
            "relative flex-shrink-0",
            "w-[300px] h-[400px] sm:w-[420px] sm:h-[560px]",
            "md:w-[360px] md:h-[480px]",
            "lg:w-[400px] lg:h-[520px]",
            "xl:w-[430px] xl:h-[560px]"
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt || "Brand image"}
            fill
            className="object-cover rounded-[40%_10%_20%_20%/50%_20%_20%_40%]"
          />
        </div>
      )}
      <div ref={textRef} className="w-full max-w-3xl">
        {children}
      </div>
    </section>
  );
};

export default BrandSection;
