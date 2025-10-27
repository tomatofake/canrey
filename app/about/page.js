import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Image from "next/image";

const About = () => {
  return (
    <>
      <Header />
      <main className="px-4 md:px-8 xl:px-20 max-w-[1600px] mx-auto text-primary pt-10">
        <h1 className="text-5xl font-bold text-center mt-16 mb-10">
          Про компанію
        </h1>
        <div className="flex flex-col xlg:flex-row items-center xl:items-start gap-10 my-16">
          <div className="w-full xl:w-1/2">
            <Image
              src="/assets/images/about.png"
              width={720}
              height={480}
              alt="canrey"
              className="w-full h-auto rounded-xl object-cover"
              priority
            />
          </div>
          <article className="text-xl sm:text-2xl xl:text-3xl max-w-2xl">
            <p>
              Компанія <strong>Canrey s.r.o.</strong> входить до складу міжнародної
              корпорації Canrey Polimax Group, що забезпечує відповідну фінансову
              та технічну підтримку.
            </p>
            <p className="mt-6">
              Група Canrey має свої виробничі потужності в Чеській Республіці та
              Туреччині. Уже багато років ми розробляємо і виробляємо опалювальні
              прилади, що вирізняються високою ефективністю і якістю — продукцію
              на природному газі, що підтверджує наші лідируючі позиції в цій
              галузі.
            </p>
            <div className="mt-10 text-lg sm:text-xl">
              <p className="font-semibold">Наша адреса:</p>
              <p>Місто Одеса, вул. Василя Стуса, 2/1</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
