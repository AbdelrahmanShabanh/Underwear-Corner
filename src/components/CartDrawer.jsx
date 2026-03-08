import { useNavigate } from "react-router-dom";

const categoryIcons = {
  men: <i className="fa-solid fa-person" />,
  women: <i className="fa-solid fa-person-dress" />,
  kids: <i className="fa-solid fa-child" />,
};

const categoryLabels = {
  en: { men: "Men", women: "Women", kids: "Kids" },
  ar: { men: "رجالي", women: "حريمي", kids: "أطفالي" },
};

const CartDrawer = ({ language, open, items, onClose, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  if (!open) return null;

  // Group items by category
  const groups = items.reduce((acc, item) => {
    const cat = item.category || "men";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isRtl = language === "ar";

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="cart-header">
          <h2 className="cart-title">{isRtl ? "سلة التسوق" : "CART"}</h2>
          <button type="button" className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <i className="fa-solid fa-xmark" />
          </button>
        </header>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <span className="cart-empty-icon">🛒</span>
              <p className="cart-empty-text">
                {isRtl ? "سلة التسوق فارغة." : "Your cart is empty."}
              </p>
            </div>
          ) : (
            <div className="cart-groups">
              {Object.entries(groups).map(([cat, groupItems]) => {
                const groupTotal = groupItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const totalQty = groupItems.reduce((s, i) => s + i.quantity, 0);
                const catLabel = (categoryLabels[language] || categoryLabels.en)[cat] || cat;

                return (
                  <div key={cat} className="cart-group">
                    {/* Brand / Category row */}
                    <div className="cart-group-header">
                      <div className="cart-group-brand">
                        <div className="cart-brand-icon">{categoryIcons[cat] || "🏷️"}</div>
                        <div className="cart-brand-info">
                          <span className="cart-brand-name">{catLabel}</span>
                          <span className="cart-brand-count">
                            {totalQty} {isRtl ? "قطعة" : totalQty === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                      <div className="cart-group-subtotal">
                        <span className="cart-subtotal-amount">
                          LE {groupTotal.toFixed(2)}
                        </span>
                        <span className="cart-subtotal-label">
                          {isRtl ? "المجموع" : "Subtotal"}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="cart-items">
                      {groupItems.map((item) => {
                        return (
                          <li key={`${item._id}-${item.size}`} className="cart-item">
                            {/* Product image */}
                            <div className="cart-item-img-wrap">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name[language] || item.name.en}
                                  className="cart-item-img"
                                />
                              ) : (
                                <div className="cart-item-img-placeholder">
                                  {categoryIcons[cat] || "🏷️"}
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="cart-item-details">
                              <p className="cart-item-name">{item.name[language] || item.name.en}</p>
                              <p className="cart-item-price">LE {item.price.toFixed(2)}</p>
                              {item.color && (
                                <p className="cart-item-attr">
                                  <span className="cart-attr-label">{isRtl ? "اللون:" : "Color:"}</span>
                                  {" "}{item.color}
                                </p>
                              )}
                              {item.size && (
                                <p className="cart-item-attr">
                                  <span className="cart-attr-label">{isRtl ? "المقاس:" : "Size:"}</span>
                                  {" "}{item.size}
                                </p>
                              )}

                              {/* Quantity control */}
                              <div className="cart-qty-row">
                                <button
                                  className="cart-qty-btn"
                                  aria-label="Decrease quantity"
                                  onClick={() => {
                                    if (item.quantity === 1) onRemove(item);
                                    else onUpdateQuantity(item, item.quantity - 1);
                                  }}
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                                <span className="cart-qty-value">{item.quantity}</span>
                                <button
                                  className="cart-qty-btn"
                                  aria-label="Increase quantity"
                                  onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                                >
                                  <i className="fa-solid fa-plus" />
                                </button>
                              </div>
                            </div>

                            {/* Remove */}
                            <button
                              className="cart-item-remove"
                              aria-label="Remove item"
                              onClick={() => onRemove(item)}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky footer with checkout */}
        <footer className="cart-footer">
          <button
            type="button"
            className="cart-checkout-btn"
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
          >
            {isRtl ? "إتمام الشراء" : "CHECKOUT"}
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default CartDrawer;
