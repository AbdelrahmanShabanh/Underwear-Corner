import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { translations } from "../i18n";

const ProductGrid = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];

  // Pick first 6 items for the featured grid (or filter by specific criteria)
  const featuredProducts = products.slice(0, 6);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="products">
      <div className="section-header">
        <h2>{t.featuredCollection}</h2>
      </div>
      <div className="products-grid">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className={`product-card ${product.isSoldOut ? "is-sold-out" : ""}`}
            onClick={() => handleCardClick(product)}
            style={{ cursor: "pointer" }}
          >
            <div className="product-media">
              {product.isSoldOut && (
                <div className="sold-out-badge">
                  {language === "en" ? "Sold Out" : "نفدت الكمية"}
                </div>
              )}
              <img src={product.image || "/product-placeholder.jpg"} alt={product.name[language]} />
            </div>
            <div className="product-body">
              <h3 className="product-title">{product.name[language]}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

