import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "../i18n";

const ProductGrid = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        // Pick first 6 items for the featured grid
        setProducts(res.data.products.slice(0, 6));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  if (loading) {
    return (
      <section className="products">
        <div className="section-header"><h2>{t.featuredCollection}</h2></div>
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <div className="admin-loading-spinner" />
        </div>
      </section>
    );
  }

  return (
    <section className="products">
      <div className="section-header">
        <h2>{t.featuredCollection}</h2>
      </div>
      <div className="products-grid">
        {products.map((product) => {
          const isSoldOut = product.stock === 0;
          return (
            <article
              key={product._id}
              className={`product-card ${isSoldOut ? "is-sold-out" : ""}`}
              onClick={() => handleCardClick(product)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-media">
                {isSoldOut && (
                  <div className="sold-out-badge">
                    {language === "en" ? "Sold Out" : "نفدت الكمية"}
                  </div>
                )}
                <img src={product.image || "/product-placeholder.jpg"} alt={product.name[language]} />
              </div>
              <div className="product-body">
                <h3 className="product-title">{product.name[language]}</h3>
                <p className="product-price">LE {product.price.toFixed(2)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;

