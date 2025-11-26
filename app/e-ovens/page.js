"use client";
import { useState, useEffect } from "react";
import { getData } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BackButton from "@/components/BackButton/BackButton";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export default function EOvens() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getData("Електричні духовки");
      setProducts(data);
      setFiltered(data);
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[100vh] max-w-[1920px] mx-auto px-5 xl:px-8 py-24 md:py-28">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:gap-6">
          <div className="mb-2 lg:mb-0">
            <BackButton />
          </div>
          <h1 className="text-4xl text-primary font-bold">Електричні духовки</h1>
        </div>

        <div className="flex lg:gap-8">
          <div className="hidden lg:block">
            <ProductFilters
              products={products}
              availableFilters={["size", "color"]}
              onFilter={setFiltered}
              onFilteringChange={setLoading}
            />
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <ProductFilters
                products={products}
                availableFilters={["size", "color"]}
                onFilter={setFiltered}
                onFilteringChange={setLoading}
              />
            </div>

            <ProductGrid products={filtered} loading={loading} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}