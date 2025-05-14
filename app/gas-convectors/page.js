'use client';
import { useState, useEffect } from "react";
import { getData } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import BackButton from "@/components/BackButton/BackButton";
import ProductFilters from "@/components/ProductFilters/ProductFilters";

const GasConvectors = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("Газові конвектори");
      setProducts(data);
      setFiltered(data);
      console.log("Loaded products:", data);

    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-[100vh] max-w-[1920px] mx-auto p-5 xl:px-8">
        <div className="mb-4 flex flex-col xl:flex-row xl:items-center xl:gap-6">
          <div className="mb-2 xl:mb-0">
            <BackButton />
          </div>
          <h1 className="text-4xl font-bold">Газові конвектори</h1>
        </div>

        <div className="xl:flex xl:gap-8">
          <div className="hidden xl:block">
            <ProductFilters
              products={products}
              onFilter={setFiltered}
              availableFilters={["power", "heatExchangerMaterial"]}
            />
          </div>

          <div className="w-full xl:w-5/6">
            <div className="xl:hidden mb-4">
              <ProductFilters
                products={products}
                onFilter={setFiltered}
                availableFilters={["power", "heatExchangerMaterial"]}
              />
            </div>

            <ProductCard products={filtered} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GasConvectors;

