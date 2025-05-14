import Footer from "@/components/Footer/Footer"
import Header from "@/components/Header/Header"
import Image from "next/image"

const About = () => {
  return (
    <>
      <Header />
      <main className="mx-10">
        <h1 className="text-5xl font-bold text-center mt-16 mb-10">
          Про компанію
        </h1>
        <div className="flex items-center my-16">
          <Image className="mr-[220px]" src='/assets/images/about.png' width={720} height={480} alt="canrey"/>
          <article className="text-3xl max-w-[600px]">
          Компанія Canrey s.r.o. входить до складу міжнародної корпорації Canrey Polimax Group, що забезпечує відповідну фінансову та технічну підтримку.
          Група Canrey має свої виробничі потужності в Чеській Республіці та Туреччині. 
          Уже багато років, ми розробляємо і виробляємо опалювальні прилади, що вирізняються високою ефективністю і якістю, продукцію на природному газі, що підтверджує наші лідируючі позиції в цій галузі.
          <p className="mt-8">Наша адреса:</p>
          <p>Місто Одеса, вул. Василя Стуса, 2/1</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default About