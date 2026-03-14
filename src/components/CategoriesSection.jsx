import { useNavigate } from "react-router-dom";
import { translations } from "../i18n";

const categoriesData = [
  {
    id: "men",
    labelKey: "men",
    image: "/gg.jpeg",
  },
  {
    id: "women",
    labelKey: "women",
    image: "/ff.jpeg",
  },
  {
    id: "kids",
    labelKey: "kids",
    image: "/WhatsApp Image 2026-03-14 at 10.28.00 PM.jpeg",
  },
];

const CategoriesSection = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];

  const handleClick = (categoryId) => {
    navigate(`/categories?category=${categoryId}`);
  };

  return (
    <section className="home-categories">
      <div className="section-header">
        <h2>{t.ourCategories}</h2>
      </div>
      <div className="home-categories-grid">
        {categoriesData.map((cat) => (
          <article
            key={cat.id}
            className="home-category-card"
            onClick={() => handleClick(cat.id)}
          >
            <div className="home-category-card__img-wrap">
              <img
                src={cat.image}
                alt={t[cat.labelKey]}
                className="home-category-card__img"
                loading="lazy"
              />
            </div>
            <div className="home-category-card__overlay" />
            <div className="home-category-card__content">
              <h3 className="home-category-card__title">{t[cat.labelKey]}</h3>
              <span className="home-category-card__subtitle">{t.newCollection}</span>
              <button className="home-category-card__btn" type="button">
                {t.shopNow}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
