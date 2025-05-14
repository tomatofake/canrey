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
      <main className="pt-12 pl-[10%] h-[calc(100vh-80px)] overflow-y-hidden">
        <BackButton className="mb-4 px-6 py-4">
          <FaArrowLeft className="mr-2" />
          <span className="text-xl">Назад</span>
        </BackButton>
        <div className="flex">
          <ProductGallery images={product.images} />
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl font-bold">Характеристики:</p>
            <p>Колір: {product.color}</p>
            <p>Розмір: {product.size}</p>
            <p>{product.specs}</p>
            <p>{product.description}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;
