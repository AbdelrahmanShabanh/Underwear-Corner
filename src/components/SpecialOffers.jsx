import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { translations } from "../i18n";

const SpecialOffers = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];

  const offerProducts = products.filter(p => p.isOffer);

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="products products--offers">
      <div className="section-header">
        <h2>{t.specialOffers}</h2>
      </div>
      <div className="products-grid">
        {offerProducts.map((product) => (
          <article
            key={product.id}
            className={`product-card ${product.isSoldOut ? "is-sold-out" : ""}`}
            onClick={() => handleCardClick(product)}
            style={{ cursor: "pointer" }}
          >
            <div className="product-media">
              <span className="offer-badge">
                {language === "en" ? "Offer" : "عرض"}
              </span>
              {product.isSoldOut && (
                <div className="sold-out-badge">
                  {language === "en" ? "Sold Out" : "نفدت الكمية"}
                </div>
              )}
              <img src={product.image || "/product-placeholder.jpg"} alt={product.name[language]} />
            </div>
            <div className="product-body">
              <h3 className="product-title">{product.name[language]}</h3>
              <div className="product-priceRow">
                <span className="product-oldPrice">{product.oldPrice}</span>
                <span className="product-newPrice">{product.price}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;

