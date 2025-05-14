"use client";
import Link from "next/link";
import CatalogItem from "../CatalogItem/CatalogItem";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Catalog = () => {
  const leftRef = useRef(null);
  const centerRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const animateFrom = (ref, x = 0, y = 0) => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
        }
      );
    };

    animateFrom(leftRef, -150, 0);
    animateFrom(centerRef, 0, 150);
    animateFrom(rightRef, 150, 0);
  }, []);

  return (
    <section className="flex flex-col md:mx-10 mx-3 md:my-[120px] my-[60px]">
      <div className="text-center text-5xl font-bold mt-2 mb-10">
        <h2>Каталог</h2>
      </div>
      <div className="flex flex-col xlg:flex-row flex-wrap justify-center items-center">
        <div ref={leftRef} className="m-5">
          <Link href="/ovens">
            <CatalogItem title="Плити" src="/assets/images/ovens.jpg" />
          </Link>
        </div>
        <div ref={centerRef} className="m-5">
          <Link href="/gas-convectors">
            <CatalogItem title="Газові конвектори" src="/assets/images/convectors.jpg" />
          </Link>
        </div>
        <div ref={rightRef} className="m-5">
          <Link href="/e-ovens">
            <CatalogItem title="Електричні духовки" src="/assets/images/eovens.jpg" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
