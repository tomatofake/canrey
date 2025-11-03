"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  products = [],
  imageFit = "cover",
}) {
  if (!products?.length) return null;

  const fitClass = imageFit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
      {products.map((product) => {
        const url = product?.images?.[0]?.asset?.url || null;

        return (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="
              group relative rounded-2xl overflow-hidden
              bg-[#141414] ring-1 ring-white/10
              transition-[transform,box-shadow,ring] duration-300
              hover:-translate-y-[2px] hover:ring-white/25
              hover:shadow-[0_10px_40px_rgba(255,255,255,0.08)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
            "
          >
            <div className="relative" style={{ aspectRatio: "3 / 4" }}>
              <div className={`absolute inset-0`}>
                <div className="relative w-full h-full">
                  {url ? (
                    <Image
                      src={url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 33vw, 400px"
                      className={`
                        ${fitClass}
                        [backface-visibility:hidden] will-change-transform
                        transition-transform duration-400
                        group-hover:scale-[1.03]
                      `}
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/40">
                      No image
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/14" />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl transition duration-300 group-hover:ring-white/25" />
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-[15px] sm:text-base font-semibold text-white/95 leading-snug line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-3 flex items-center justify-between text-white/70">
                <span className="text-[12px]">Деталі</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/95">
                  Переглянути
                  <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90 group-hover:translate-x-0.5 transition-transform">
                    <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}