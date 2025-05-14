'use client';
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";
import Image from "next/image"
import { useState } from "react";
import CatalogOverlay from "../CatalogOverlay/CatalogOverlay";

const Footer = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <footer className="bg-black text-white px-5 py-10 md:px-10">
      <div className="flex flex-col xlg:flex-row justify-between gap-10 items-start xlg:items-end">
        
        <div className="max-w-[600px]">
          <h2 className="text-xl md:text-2xl mb-6 leading-7">
            Зацікавлені у співробітництві, наших продуктах або виникли якісь питання? Зв'язатись з нами:
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <FaPhone className="mr-3 text-lg" />
              <a className="text-lg md:text-xl" href="tel:+380675110148">+380675110148</a>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-3 text-lg" />
              <a className="text-lg md:text-xl" href="mailto:canrey@ukr.net">canrey@ukr.net</a>
            </div>
          </div>
        </div>

        <nav className="text-lg md:text-2xl w-full md:w-auto">
          <ul className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
            <li className="group">
              <Link href='/'>Головна</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group cursor-pointer" onClick={() => setIsCatalogOpen(true)}>
              <span>Каталог</span>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group">
              <Link href='/partners'>Наші партнери</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
            <li className="group">
              <Link href='/about'>Про нас</Link>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex justify-center py-10">
        <Image src='/assets/images/png.png' width={280} height={160} alt="logo" className="h-auto w-auto max-w-[70%] md:max-w-none" />
      </div>

      <div className="text-white/50 text-center text-sm">
        © 2025 Canrey. Всі права захищені.
      </div>

      {isCatalogOpen && <CatalogOverlay onClose={() => setIsCatalogOpen(false)} />}
    </footer>
  );
};

export default Footer;
