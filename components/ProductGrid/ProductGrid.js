"use client";

import ProductCard from "@/components/ProductCard/ProductCard";

const ProductSkeleton = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[.03] animate-pulse overflow-hidden">
    <div className="aspect-[3/4] bg-white/10" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-white/10 rounded" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
    </div>
  </div>
);

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 w-full md:grid-cols-2 xlg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }
  return <ProductCard products={products} />;
}
