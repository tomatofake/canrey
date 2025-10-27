'use client';
import { useState, useEffect } from "react";
import { getData } from "@/app/lib/sanity";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import ProductCard from "@/components/ProductCard/ProductCard";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BackButton from "@/components/BackButton/BackButton";

const EOvens = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("Електричні духовки");
      setProducts(data);
      setFiltered(data);
    };
    fetchData();
  }, []);

  return (
  <>
    <Header />
    <main className="min-h-[100vh] max-w-[1920px] mx-auto p-5 xl:px-8 pt-[6%]">
      <div className="mb-6 flex flex-col xlg:flex-row xlg:items-center xlg:gap-6">
        <div className="mb-2 xl:mb-0">
          <BackButton />
        </div>
        <h1 className="text-4xl text-primary font-bold">Електричні духовки</h1>
      </div>

      <div className="xl:flex xl:gap-8">
        <div className="hidden xl:block">
          <ProductFilters
            products={products}
            onFilter={setFiltered}
            availableFilters={["size", "color"]}
          />
        </div>

        <div className="flex flex-col xlg:gap-8 xlg:flex-row xl:w-5/6">
          <div className="xl:hidden">
            <ProductFilters
              products={products}
              onFilter={setFiltered}
              availableFilters={["size", "color"]}
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

export default EOvens;

