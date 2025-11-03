"use client";
import { useState, useEffect } from "react";
import { getData } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BackButton from "@/components/BackButton/BackButton";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export default function GasConvectors() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getData("Газові конвектори");
      setProducts(data);
      setFiltered(data);
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[100vh] max-w-[1920px] mx-auto p-5 pt-[6%] xl:px-8">
        <div className="mb-4 flex flex-col xl:flex-row xl:items-center xl:gap-6">
          <div className="mb-2 xl:mb-0">
            <BackButton />
          </div>
          <h1 className="text-4xl text-primary font-bold">Газові конвектори</h1>
        </div>

        <div className="xl:flex xl:gap-8">
          <div className="hidden xlg:block">
            <ProductFilters
              products={products}
              availableFilters={["power", "heatExchangerMaterial"]}
              onFilter={setFiltered}
              onFilteringChange={setLoading}
            />
          </div>

          <div className="flex flex-col xlg:gap-8 xlg:flex-row xl:w-5/6">
            <div className="xlg:hidden">
              <ProductFilters
                products={products}
                availableFilters={["power", "heatExchangerMaterial"]}
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