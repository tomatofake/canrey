import { client } from "@/app/lib/sanity";
import BackButton from "@/components/BackButton/BackButton";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ProductGallery from "@/components/ProductGallery/ProductGallery";
import { FaArrowLeft } from "react-icons/fa6";

const getData = async (slug) => {
  const query = `*[_type == 'product' && slug.current == $slug][0] {
    _id,
    images,
    name,
    description,
    specs,
    size,
    color,
    'slug': slug.current,
    'category': categories->{name}
  }`;
  return await client.fetch(query, { slug });
};

const ProductDetails = async ({ params }) => {
  const product = await getData(params.slug);
  if (!product) return <p className="text-center text-xl py-10">Товар не знайдено</p>;

  return (
    <>
      <Header />
      <main className="py-6 xl:py-12 px-10 xl:px-[10%]">
        <div className="mb-4">
          <BackButton className="flex items-center gap-2 px-4 py-2 w-fit xl:px-6 xl:py-4">
            <FaArrowLeft />
            <span className="text-base xl:text-xl">Назад</span>
          </BackButton>
          <h2 className="text-3xl font-bold my-4">{product.name}</h2>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-1/2 flex justify-center xl:justify-start">
            <ProductGallery images={product.images} />
          </div>

          <div className="w-full xl:w-1/2">
            <p className="text-2xl font-semibold mb-2">Характеристики:</p>
            <ul className="space-y-2 text-xl">
              <li>Колір: {product.color}</li>
              <li>Розмір: {product.size}</li>
              <li>{product.specs}</li>
              <li>{product.description}</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;