import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { translations } from "../i18n";
import { categories as categoryList } from "../data/products";
import Reveal from "../components/Reveal";
import { ProductGridSkeleton } from "../components/SkeletonLoader";

const Categories = ({ language, searchQuery }) => {
  const t = translations[language];
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "men";
  const [activeId, setActiveId] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && ["men", "women", "kids"].includes(cat)) {
      setActiveId(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
  }, [activeId, searchQuery, products]);

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
              onClick={() => {
                setActiveId(cat.id);
                setSearchParams({ category: cat.id });
              }}
            >
              <h2>{cat.label[language]}</h2>
            </article>
          ))}
        </div>

        {loading ? (
          <div style={{ marginTop: "1.5rem" }}>
            <ProductGridSkeleton count={6} />
          </div>
        ) : (
          <Reveal delayMs={80}>
            <div className="products-grid products-grid--categories">
              {filteredProducts.length === 0 ? (
                <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                  {language === "en" ? "No products found." : "لا توجد منتجات."}
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const isSoldOut = product.stock === 0;
                  return (
                    <article
                      key={product._id}
                      className={`product-card ${isSoldOut ? "is-sold-out" : ""}`}
                      onClick={() => navigate(`/product/${product._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-media">
                        {product.isOffer && (
                          <span className="offer-badge" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "#d6b15e", color: "#111", padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                            {language === "en" ? "Offer" : "عرض"}
                          </span>
                        )}
                        {isSoldOut && (
                          <div className="sold-out-badge">
                            {language === "en" ? "Sold Out" : "نفدت الكمية"}
                          </div>
                        )}
                        <img
                          src={product.image || "/product-placeholder.jpg"}
                          alt={product.name[language]}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-body">
                        <h3 className="product-title">{product.name[language]}</h3>
                        <div className="product-priceRow" style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                          {product.isOffer && product.oldPrice && (
                           <span className="product-oldPrice" style={{ color: "#ef4444", textDecoration: "line-through", fontSize: "0.85rem" }}>
                             LE {product.oldPrice.toFixed(2)}
                           </span>
                          )}
                          <p className="product-price" style={{ margin: 0 }}>LE {product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </Reveal>
        )}
      </section>
    </Reveal>
  );
};

export default Categories;


