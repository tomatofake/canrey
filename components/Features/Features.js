import BrandSection from "../BrandSection/BrandSection";

const Features = () => {
  return (
    <section className="overflow-hidden">
      <BrandSection imageSrc="/assets/images/br1.jpg" imageAlt="SuperTech">
        <p className="md:text-5xl sm:text-3xl text-3xl text-primary xlg:text-left sm:text-center md:leading-normal">
          Висока якість в комбінації з вишуканим дизайном, з 2002 року
        </p>
      </BrandSection>

      {/* <BrandSection
        imageSrc="/assets/images/br2.jpg"
        imageAlt="ThermoMaster"
        reverse
      >
        <p>
          <strong>ThermoMaster</strong> — це німецький бренд із понад 30-річною
          історією. Ми — ексклюзивний дистриб’ютор на території України.
        </p>
      </BrandSection> */}
    </section>
  );
};

export default Features;
