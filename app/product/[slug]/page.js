import { notFound } from "next/navigation";
import { client } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductGallery from "@/components/ProductGallery/ProductGallery";
import BackButton from "@/components/BackButton/BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductBySlug(slug) {
  const query = `
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      description,
      specs,
      size,
      color,
      images,
      "slug": slug.current,
      "categories": categories[]->{name}
    }
  `;
  return client.fetch(query, { slug });
}

export default async function ProductDetails(props) {

  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

   return (
    <>
      <Header />

      <main className="text-white min-h-screen py-[120px] px-6 md:px-[8%] xl:px-[10%] transition-all">
        <BackButton className="mb-4"/>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-col md:flex-col xlg:flex-row gap-12 items-start justify-between">
          <div className="w-full xl:w-1/2">
            <ProductGallery images={product.images} />
          </div>

          <div className="w-full xl:w-1/2 flex flex-col gap-4 text-base md:text-lg leading-relaxed">
            <h2 className="text-2xl font-semibold mb-2">Характеристики:</h2>

            <ul className="space-y-2">
              {product.color && (
                <li>
                  <b className="text-neutral-300">Колір:</b> {product.color}
                </li>
              )}
              {product.size && (
                <li>
                  <b className="text-neutral-300">Розмір:</b> {product.size}
                </li>
              )}
              {product.specs && (
                <li className="whitespace-pre-line">{product.specs}</li>
              )}
              {product.description && (
                <li className="whitespace-pre-line">{product.description}</li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}