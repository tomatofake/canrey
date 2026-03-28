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
      size,
      specs,
      dimensions, 
      packageDimensions, 
      color, 
      weight, 
      weightPackaged, 
      features, 
      volume,
      bodyMaterial, 
      ovenType, 
      powerCord, 
      networkConnection, 
      gasConnection, 
      innerCoating,
      cleaningType, 
      railType, 
      surfaceConfiguration, 
      lidType, 
      packageContents, 
      railLevels,
      cookingModes, 
      ovenGlassCount, 
      grillType, 
      gasControl, 
      gasNozzles, 
      plugIncluded,
      electricIgnitionTop, 
      electricIgnitionBottom, 
      ovenLighting, 
      ovenCategory, 
      gridMaterial,
      power, 
      installationType, 
      gasType, 
      workingArea, 
      heatExchangerMaterial,
      combustionChamberDesign, 
      ignitionType, 
      gasConsumption, 
      chimneyDiameter, 
      chimneyLength,
      temperatureRange, 
      timer,
      images,
      "slug": slug.current,
      "categories": categories[]->{name}
    }
  `;
  return client.fetch(query, { slug });
}

// Словник текстових характеристик
const SPEC_LABELS = {
  color: "Колір",
  size: "Розмір",
  dimensions: "Габарити (В х Ш х Г)",
  packageDimensions: "Габарити в упаковці (ВхШхГ)",
  weight: "Вага",
  weightPackaged: "Вага в упаковці",
  volume: "Об'єм",
  bodyMaterial: "Матеріал корпусу",
  ovenType: "Тип духовки",
  ovenCategory: "Тип плити",
  surfaceConfiguration: "Конфігурація поверхні",
  gridMaterial: "Матеріал решіток",
  innerCoating: "Внутрішнє покриття",
  cleaningType: "Тип очищення",
  railType: "Тип напрямних",
  railLevels: "Кількість рівнів напрямних",
  cookingModes: "Кількість режимів",
  ovenGlassCount: "Кількість стекол у дверцятах",
  temperatureRange: "Діапазон температури",
  timer: "Таймер",
  grillType: "Гриль",
  gasControl: "Газ-контроль",
  gasNozzles: "Форсунки для балонного газу",
  lidType: "Кришка варильної поверхні",
  power: "Номінальна теплова потужність",
  installationType: "Тип монтажу",
  gasType: "Тип газу",
  workingArea: "Площа обслуговування",
  heatExchangerMaterial: "Матеріал теплообмінника",
  combustionChamberDesign: "Конструкція камери згоряння",
  ignitionType: "Вид розпалу",
  gasConsumption: "Витрата газу",
  chimneyDiameter: "Діаметр димоходу",
  chimneyLength: "Довжина димоходу",
  powerCord: "Наявність шнура живлення",
  networkConnection: "Підключення до мережі",
  gasConnection: "Підключення до балонного газу",
  plugIncluded: "Наявність вилки",
  packageContents: "Комплектація",
  features: "Особливості",
  specs: "Додаткові специфікації"
};

// Словник булевих (Так/Ні) характеристик
const BOOLEAN_LABELS = {
  electricIgnitionTop: "Електропіджиг поверхні",
  electricIgnitionBottom: "Електропіджиг духовки",
  ovenLighting: "Підсвітка духовки",
};

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
              {/* Рендеримо текстові характеристики */}
              {Object.entries(SPEC_LABELS).map(([key, label]) => {
                if (product[key]) {
                  return (
                    <li key={key}>
                      <b className="text-neutral-300">{label}:</b>{" "}
                      {/* Додаємо 'кг', якщо це вага */}
                      {key.includes('weight') ? `${product[key]}` : product[key]}
                    </li>
                  );
                }
                return null;
              })}

              {/* Рендеримо булеві характеристики */}
              {Object.entries(BOOLEAN_LABELS).map(([key, label]) => {
                if (product[key] !== undefined && product[key] !== null) {
                  return (
                    <li key={key}>
                      <b className="text-neutral-300">{label}:</b>{" "}
                      {product[key] ? "Так" : "Ні"}
                    </li>
                  );
                }
                return null;
              })}

              {/* Опис виводимо окремо через whitespace-pre-line */}
              {product.description && (
                <li className="whitespace-pre-line mt-4 pt-4 border-t border-white/10">
                  <b className="text-neutral-300 block mb-1">Опис:</b>
                  {product.description}
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}