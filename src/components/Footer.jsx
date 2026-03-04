import { Link } from "react-router-dom";
import { translations } from "../i18n";

const Footer = ({ language }) => {
  const t = translations[language];
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logoText">{t.footer.brand}</div>
          <div className="footer-tagline">{t.footer.tagline}</div>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <div className="footer-colTitle">{t.footer.quickLinks}</div>
            <div className="footer-links">
              <Link to="/">{t.nav.home}</Link>
              <Link to="/categories">{t.nav.categories}</Link>
              <Link to="/contact">{t.nav.contact}</Link>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-colTitle">{t.footer.contact}</div>
            <div className="footer-links">
              <a href="mailto:hello@underwearcorner.com">hello@underwearcorner.com</a>
              <a href="tel:+200000000000">+20 000 000 0000</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottomInner">
          <span>
            © {year} {t.footer.brand}. {t.footer.rights}
          </span>
          <span className="footer-made">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/abdelrahman-shabann">
              {language === "en" ? (
  <>
    Designed by{" "}
    <span style={{ color: "#d6b15e", textDecoration: "underline" }}>
      Abdelrahman Shaban
    </span>
  </>
) : (
  <>
    تصميم{" "}
    <span style={{ color: "#d6b15e", textDecoration: "underline" }}>
      Abdelrahman Shaban
    </span>
  </>
)}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

