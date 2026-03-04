import Hero from "../components/Hero";
import SpecialOffers from "../components/SpecialOffers";
import ProductGrid from "../components/ProductGrid";
import Reveal from "../components/Reveal";

const Home = ({ language }) => {
  return (
    <>
      <Reveal>
        <Hero language={language} />
      </Reveal>
      <Reveal delayMs={80}>
        <SpecialOffers language={language} />
      </Reveal>
      <Reveal delayMs={140}>
        <ProductGrid language={language} />
      </Reveal>
    </>
  );
};

export default Home;

