'use client';
import Link from 'next/link';
import { FaPhone } from 'react-icons/fa6';
import { FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';
import CatalogOverlay from '../CatalogOverlay/CatalogOverlay';

export default function Footer() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <footer className="bg-black/60 text-primary px-5 py-10 md:px-10">
      <div className="flex flex-col xlg:flex-row xlg:items-end xlg:justify-between gap-10">
        <div className="max-w-[600px]">
          <h2 className="text-xl md:text-2xl mb-6 leading-7">
            Зацікавлені у співробітництві, наших продуктах або виникли якісь питання? Зв'язатись з нами:
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <FaPhone className="mr-3 text-lg" />
              <a className="text-lg md:text-xl" href="tel:+380675110148">+380672808555</a>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-3 text-lg" />
              <a className="text-lg md:text-xl" href="mailto:canrey@ukr.net">canrey@ukr.net</a>
            </div>
          </div>
        </div>

        <nav className="text-xl xl:text-2xl w-full md:w-auto">
          <ul className="flex flex-col gap-4">
            <li className="group w-fit">
              <Link href="/">Головна</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group w-fit cursor-pointer" onClick={() => setIsCatalogOpen(true)}>
              <span>Каталог</span>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group w-fit">
              <Link href="/partners">Наші партнери</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group w-fit">
              <Link href="/about">Про нас</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10">
        <div className="flex justify-between items-center">
          <Image
            src="/assets/images/png.png"
            width={160}
            height={90}
            alt="Canrey"
            className="h-auto w-auto"
          />
          <div className="text-white/50 text-center text-sm">
            © 2025 Canrey. Всі права захищені.
          </div>
        </div>
      </div>

      {isCatalogOpen && <CatalogOverlay onClose={() => setIsCatalogOpen(false)} />}
    </footer>
  );
}
