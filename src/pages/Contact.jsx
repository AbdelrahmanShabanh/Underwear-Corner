import { translations } from "../i18n";
import Reveal from "../components/Reveal";

const Contact = ({ language }) => {
  const t = translations[language];

  return (
    <Reveal>
      <section className="page page-contact">
        <header className="page-header">
          <h1>{t.contactHeading}</h1>
          <p className="page-subtitle">
            {language === "en"
              ? "Have questions about sizes, styles or orders? Reach out and we’ll help."
              : "لديك أسئلة حول المقاسات، الموديلات أو الطلبات؟ تواصل معنا وسنساعدك."}
          </p>
        </header>

        <div className="contact-whatsapp-card">
          <i className="fa-brands fa-whatsapp contact-wa-icon" />
          <p>
            {language === "en"
              ? "Send us a message on WhatsApp for any problem or asking."
              : "أرسل لنا رسالة على واتساب لأي مشكلة أو استفسار."}
          </p>
          <a
            href="https://wa.me/201008872621?text=Hello%21%20I%20have%20a%20question..."
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta"
            style={{ textDecoration: "none", display: "inline-block", marginTop: "1rem" }}
          >
            {language === "en" ? "Send Message on WhatsApp" : "راسلنا على واتساب"}
          </a>
        </div>
      </section>
    </Reveal>
  );
};

export default Contact;

