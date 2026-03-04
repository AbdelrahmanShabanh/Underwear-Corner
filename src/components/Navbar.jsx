import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { translations } from "../i18n";
import { useAuth } from "../context/AuthContext";

const logo = "/logo-underwear-corner-removebg-preview.png";

const Navbar = ({
  language,
  onToggleLanguage,
  cartCount,
  onCartToggle,
  searchQuery,
  onSearchChange
}) => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const t = translations[language];

  const handleToggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Underwear Corner logo" className="navbar-logo" />
          <span className="navbar-title">under wear corner</span>
        </Link>

        <button
          className="navbar-hamburger"
          onClick={handleToggleMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-nav ${open ? "is-open" : ""}`}>
          <div className="navbar-links">
            <NavLink to="/" onClick={closeMenu}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/categories" onClick={closeMenu}>
              {t.nav.categories}
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu}>
              {t.nav.contact}
            </NavLink>
          </div>

          <div className="navbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Cart"
              onClick={() => {
                onCartToggle();
                closeMenu();
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="icon"
              >
                <path
                  d="M7 7h13l-1.5 8h-11z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="19" r="1.4" fill="currentColor" />
                <circle cx="17" cy="19" r="1.4" fill="currentColor" />
                <path
                  d="M7 7L5.5 4H3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <input
              type="search"
              className="navbar-search"
              placeholder={
                language === "en" ? "Search products" : "ابحث عن منتج"
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />

            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}

            {/* Auth buttons */}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="icon-button"
                    title="Admin Dashboard"
                    onClick={closeMenu}
                  >
                    <i className="fa-solid fa-shield-halved" style={{ fontSize: "0.85rem" }} />
                  </Link>
                )}
                <button
                  type="button"
                  className="icon-button"
                  title={language === "ar" ? "تسجيل خروج" : "Logout"}
                  onClick={() => { logout(); closeMenu(); }}
                >
                  <i className="fa-solid fa-right-from-bracket" style={{ fontSize: "0.85rem" }} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="icon-button"
                title={language === "ar" ? "تسجيل دخول" : "Sign In"}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-user" style={{ fontSize: "0.85rem" }} />
              </Link>
            )}

            <button
              type="button"
              className="language-toggle"
              onClick={() => {
                onToggleLanguage();
                closeMenu();
              }}
            >
              {t.nav.language}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

