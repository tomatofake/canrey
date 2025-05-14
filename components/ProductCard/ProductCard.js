import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => {
        const imageUrl = product.images?.[0]?.asset?.url || null;

        return (
          <Link href={`/product/${product.slug}`} key={product._id} className="flex flex-col border border-black/60 rounded-lg p-4 shadow-sm bg-white">
            {imageUrl ? (
              <Image 
                src={imageUrl}
                alt={product.name}
                priority
                width={375}
                height={275}
                className="w-full object-none rounded-md h-full"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">Колір: <span className='font-bold'>{product.color}</span></p>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductCard;
