'use client';
import Image from 'next/image';
import clsx from 'clsx';

const CatalogItem = ({ title, src, className }) => {
  return (
    <div
      className={clsx(
        `
        group relative overflow-hidden rounded-2xl
        w-full
        aspect-[10/9] xlg:aspect-[5/6]
        bg-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.10)]
        ring-1 ring-black/5
        [-webkit-mask-image:radial-gradient(#fff,#000)]
        touch-manipulation
        `,
        className
      )}
      tabIndex={0}
      aria-label={title}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl will-change-transform">
        <Image
          src={src}
          alt={title}
          fill
          draggable={false}
          sizes="(max-width: 960px) 88vw, (max-width: 1440px) 31vw, 640px"
          className="
            object-cover object-center
            transition-transform duration-700
            [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
            transform-gpu will-change-transform
            select-none pointer-events-none
            xlg:group-hover:scale-[1.05] xlg:group-focus:scale-[1.05]
          "
          priority={false}
        />

        <div
          className="
            absolute inset-0 z-10 pointer-events-none
            bg-black/35
            opacity-95
            transition-opacity duration-700
            xlg:opacity-100 xlg:group-hover:opacity-90 xlg:group-focus:opacity-90
          "
        />

        <div
          className="
            hidden xlg:block pointer-events-none absolute z-20
            -top-[20%] -left-[35%] h-[140%] w-[70%] rotate-[18deg]
            bg-gradient-to-r from-transparent via-white/70 to-transparent
            mix-blend-overlay blur-[8px] opacity-20 translate-x-0
            transition-all duration-1000 ease-out
            xlg:group-hover:opacity-90 xlg:group-hover:translate-x-[180%]
            xlg:group-focus:opacity-90 xlg:group-focus:translate-x-[180%]
          "
        />
      </div>

      <div className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center">
        <h2
          className="
            text-white font-semibold tracking-tight
            text-2xl sm:text-3xl md:text-4xl
            drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]
            select-none
            transition-all duration-600
            xlg:translate-y-1 xlg:opacity-95
            xlg:group-hover:translate-y-0 xlg:group-hover:opacity-100
            xlg:group-focus:translate-y-0 xlg:group-focus:opacity-100
          "
        >
          {title}
        </h2>
      </div>

      <div
        className="
          pointer-events-none absolute inset-0 z-30
          ring-1 ring-white/10 rounded-2xl
          opacity-0 transition-opacity duration-700
          xlg:group-hover:opacity-100 xlg:group-focus:opacity-100
        "
      />
    </div>
  );
};

export default CatalogItem;