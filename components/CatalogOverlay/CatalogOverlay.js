'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';

const categories = [
  {
    title: 'Плити',
    image: '/assets/images/ovens.jpg',
    link: '/ovens',
  },
  {
    title: 'Газові конвектори',
    image: '/assets/images/convectors.jpg',
    link: '/gas-convectors',
  },
  {
    title: 'Електричні духовки',
    image: '/assets/images/eovens.jpg',
    link: '/e-ovens',
  },
];

const CatalogOverlay = ({ onClose }) => {
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0, y: '-20%', scale: 0.98 },
      {
        opacity: 1,
        y: '0%',
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
      }
    );

    tl.fromTo(
      itemsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.3'
    );

    const handleEsc = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const closeMenu = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      y: '-50%',
      scale: 0.98,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => onClose(),
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col transition-opacity duration-500"
    >
      <button onClick={closeMenu} className="absolute top-5 right-5 text-3xl text-white z-50">
        <IoClose />
      </button>
      <h1 className="text-5xl font-bold text-center py-8 z-10">Каталог</h1>
      <div className="flex flex-col lg:flex-row flex-1 w-full h-full">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            ref={(el) => (itemsRef.current[idx] = el)}
            className="relative flex-1 group overflow-hidden flex items-center justify-center min-h-[33.333%] md:min-h-0"
            onClick={closeMenu}
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              priority
              className="object-cover brightness-[35%] group-hover:brightness-[65%] transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold">{cat.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CatalogOverlay;


