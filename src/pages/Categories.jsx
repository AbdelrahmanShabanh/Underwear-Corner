import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../i18n";
import { categories as categoryList, products } from "../data/products";
import Reveal from "../components/Reveal";

const Categories = ({ language, searchQuery }) => {
  const t = translations[language];
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("men");

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    let base = products;
    if (!q) {
      base = products.filter((p) => p.category === activeId);
    }
    return base.filter((p) => {
      if (!q) return true;
      return (
        p.name.en.toLowerCase().includes(q) ||
        p.name.ar.toLowerCase().includes(q)
      );
    });
  }, [activeId, searchQuery]);

  return (
    <Reveal>
      <section className="page page-categories">
        <header className="page-header">
          <h1>{t.categoriesHeading}</h1>
        </header>

        <div className="categories-grid categories-grid--row">
          {categoryList.map((cat) => (
            <article
              key={cat.id}
              className={`category-card ${
                cat.id === activeId ? "is-active" : ""
              }`}
              onClick={() => setActiveId(cat.id)}
            >
              <h2>{cat.label[language]}</h2>
            </article>
          ))}
        </div>

        <Reveal delayMs={80}>
          <div className="products-grid products-grid--categories">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="product-media">
                  <img
                    src={product.image}
                    alt={product.name[language]}
                  />
                </div>
                <div className="product-body">
                  <h3 className="product-title">{product.name[language]}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
    </Reveal>
  );
};

export default Categories;

