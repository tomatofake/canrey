'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Navigation from "../Navigation/Navigation";

const Header = () => {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsScrolled(currentY > 80);

      if (currentY > lastScrollY.current && currentY > 150 && !isHidden.current) {
        gsap.to(headerRef.current, {
          y: "-100%",
          duration: 0.35,
          ease: "power2.inOut",
        });
        isHidden.current = true;
      } else if (currentY < lastScrollY.current && isHidden.current) {
        gsap.to(headerRef.current, {
          y: "0%",
          duration: 0.35,
          ease: "power2.inOut",
        });
        isHidden.current = false;
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-[60] text-primary transition-all duration-500 ${
        isScrolled ? "backdrop-blur-md bg-black/60" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center py-7 px-5 md:px-10 max-w-[1920px] mx-auto">
        <Link href="/" className="text-3xl font-semibold tracking-wide">
          Canrey
        </Link>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;


