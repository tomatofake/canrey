import Catalog from "@/components/Catalog/Catalog";
import Features from "@/components/Features/Features";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Features />
      </main>
      <Footer />
    </>
  );
}