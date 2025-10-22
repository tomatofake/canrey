'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import CatalogOverlay from '../CatalogOverlay/CatalogOverlay';

const Navigation = ({ setIsOverlayOpen }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        menuRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.45, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => (document.body.style.overflow = ''),
      });
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (setIsOverlayOpen) setIsOverlayOpen(Boolean(isCatalogOpen));
  }, [isCatalogOpen, setIsOverlayOpen]);

  const handleCatalogOpen = () => {
    setIsCatalogOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="hidden lg:block">
        <ul className="flex text-xl">
          <li className="group">
            <Link href="/">Головна</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li
            className="pl-9 group cursor-pointer"
            onClick={handleCatalogOpen}
          >
            <span>Каталог</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li className="px-9 group">
            <Link href="/partners">Наші партнери</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li className="group">
            <Link href="/about">Про нас</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
        </ul>
      </nav>

      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative w-8 h-6 z-[120] flex flex-col justify-between items-center group"
          aria-label="Меню"
        >
          <span
            className={`block w-full h-[2px] bg-white rounded transition-all duration-300 ${
              isMobileMenuOpen
                ? 'rotate-45 translate-y-[12px]'
                : 'translate-y-0'
            }`}
          ></span>
          <span
            className={`block w-full h-[2px] bg-white rounded transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          ></span>
          <span
            className={`block w-full h-[2px] bg-white rounded transition-all duration-300 ${
              isMobileMenuOpen
                ? '-rotate-45 -translate-y-[10px]'
                : 'translate-y-0'
            }`}
          ></span>
        </button>

        <div
          ref={menuRef}
          style={{ transform: 'translateX(100%)' }}
          className="fixed top-0 right-0 w-full h-[100vh] bg-black text-white z-[110] flex flex-col items-center justify-center space-y-8 text-2xl"
        >
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            Головна
          </Link>
          <span
            onClick={handleCatalogOpen}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            Каталог
          </span>
          <Link href="/partners" onClick={() => setIsMobileMenuOpen(false)}>
            Наші партнери
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
            Про нас
          </Link>
        </div>
      </div>

      {isCatalogOpen && <CatalogOverlay onClose={() => setIsCatalogOpen(false)} />}
    </>
  );
};

export default Navigation;