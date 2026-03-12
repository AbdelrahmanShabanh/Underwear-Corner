import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "../i18n";
import { ProductGridSkeleton } from "./SkeletonLoader";

const SpecialOffers = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("/api/products");
        const offers = res.data.products.filter(p => p.isOffer);
        setOfferProducts(offers);
      } catch (err) {
        console.error("Failed to fetch special offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

if (loading) {
  return (
    <section className="products products--offers">
      <div className="section-header">
        <h2>{t.specialOffers}</h2>
      </div>

      <ProductGridSkeleton count={2} />
    </section>
  );
}

  if (offerProducts.length === 0) {
    return null; // Hide the section completely if no offers exist
  }

  return (
    <section className="products products--offers">
      <div className="section-header">
        <h2>{t.specialOffers}</h2>
      </div>
      <div className="special-offers-grid">
        {offerProducts.map((product) => {
          const isSoldOut = product.stock === 0;
          return (
            <article
              key={product._id}
              className={`product-card ${isSoldOut ? "is-sold-out" : ""}`}
              onClick={() => handleCardClick(product)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-media">
                <span className="offer-badge">
                  {language === "en" ? "Offer" : "عرض"}
                </span>
                {isSoldOut && (
                  <div className="sold-out-badge">
                    {language === "en" ? "Sold Out" : "نفدت الكمية"}
                  </div>
                )}
                <img src={product.image || "/product-placeholder.jpg"} alt={product.name[language]} loading="lazy" />
              </div>
              <div className="product-body">
                <h3 className="product-title">{product.name[language]}</h3>
                <div className="product-priceRow">
                  {product.oldPrice && (
                    <span className="product-oldPrice">LE {product.oldPrice.toFixed(2)}</span>
                  )}
                  <span className="product-newPrice">LE {product.price.toFixed(2)}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default SpecialOffers;

