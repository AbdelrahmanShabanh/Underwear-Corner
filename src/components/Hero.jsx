import { useNavigate } from "react-router-dom";
import { translations } from "../i18n";

const heroImage = "/hero-underwear-corner.jpeg";

const Hero = ({ language }) => {
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-media">
        <img src={heroImage} alt="Underwear collection hero" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <div className="hero-center">
          <h1 className="hero-title">{t.hero.title}</h1>
          <button
            className="hero-cta"
            type="button"
            onClick={() => navigate("/categories")}
          >
            {t.hero.cta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

