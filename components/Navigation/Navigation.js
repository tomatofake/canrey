'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import CatalogOverlay from '../CatalogOverlay/CatalogOverlay';

const Navigation = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        menuRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="hidden lg:block">
        <ul className="flex text-xl">
          <li className="group">
            <Link href='/'>Головна</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li className="pl-9 group cursor-pointer" onClick={() => setIsCatalogOpen(true)}>
            <span>Каталог</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li className="px-9 group">
            <Link href='/partners'>Наші партнери</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
          <li className="group">
            <Link href='/about'>Про нас</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </li>
        </ul>
      </nav>

      <div className="lg:hidden">
        <button
          className="w-8 h-6 relative z-50 mt-2 mr-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-0'}`}></span>
          <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'top-2.5'}`}></span>
          <span className={`absolute h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-5'}`}></span>
        </button>

        <div
          ref={menuRef}
          className="fixed top-0 right-0 w-full h-full bg-black text-white z-40 flex flex-col items-center justify-center space-y-8 text-2xl"
        >
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Головна</Link>
          <span onClick={() => {
            setIsCatalogOpen(true);
            setIsMobileMenuOpen(false);
          }} className="cursor-pointer">Каталог</span>
          <Link href="/partners" onClick={() => setIsMobileMenuOpen(false)}>Наші партнери</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Про нас</Link>
        </div>
      </div>

      {isCatalogOpen && <CatalogOverlay onClose={() => setIsCatalogOpen(false)} />}
    </>
  );
};

export default Navigation;
