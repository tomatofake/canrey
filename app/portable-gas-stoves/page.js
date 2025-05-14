import { getData } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";

const PGStoves = async () => {
  const pgstoves = await getData("Газові таганки");
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Газові таганки</h1>
        <ProductCard products={pgstoves} />
      </main>
      <Footer />
    </>
  )
}

export default PGStoves


