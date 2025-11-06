import { notFound } from "next/navigation";
import { client } from "@/app/lib/sanity";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductGallery from "@/components/ProductGallery/ProductGallery";

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
      <main className="py-6 xl:py-12 px-6 xl:px-[10%] text-primary">
        <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-1/2">
            <ProductGallery images={product.images} />
          </div>

          <div className="w-full xl:w-1/2">
            <p className="text-2xl font-semibold mb-3">Характеристики:</p>
            <ul className="space-y-2 text-lg">
              {product.color && <li><b>Колір:</b> {product.color}</li>}
              {product.size && <li><b>Розмір:</b> {product.size}</li>}
              {product.specs && <li>{product.specs}</li>}
              {product.description && <li>{product.description}</li>}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}