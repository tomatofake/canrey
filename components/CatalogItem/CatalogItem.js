import Image from "next/image";

const CatalogItem = ({ title, src }) => {
  return (
    <div className="relative bg-white flex h-[500px] w-full max-w-[570px] hover:scale-[1.01] transform-gpu transition-all overflow-hidden">
      <Image
        src={src}
        alt={title}
        width={570}
        height={550}
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute text-white text-center text-3xl z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap">
        <h2 className="inline-block">{title}</h2>
      </div>
      <div className="absolute w-full h-full bg-black/65 top-0 left-0 z-10" />
      <div className="absolute w-full h-full top-0 left-0 transition-all hover:bg-black/35 z-20" />
    </div>
  );
};

export default CatalogItem;
