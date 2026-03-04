import { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { languages } from "./i18n";
import CartDrawer from "./components/CartDrawer";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  const [language, setLanguage] = useState(languages.ar);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === languages.en ? languages.ar : languages.en));
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (target, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === target.id && item.size === target.size
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeFromCart = (target) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === target.id && item.size === target.size))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const direction = useMemo(
    () => (language === languages.ar ? "rtl" : "ltr"),
    [language]
  );

  return (
    <AuthProvider>
      <div className="app" data-theme="dark" dir={direction}>
        <Routes>
          {/* Admin route — no navbar/footer */}
          <Route
            path="/admin"
            element={<AdminDashboard language={language} />}
          />

          {/* All other routes — with navbar/footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar
                  language={language}
                  onToggleLanguage={toggleLanguage}
                  cartCount={cartCount}
                  onCartToggle={() => setIsCartOpen((prev) => !prev)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                <CartDrawer
                  language={language}
                  open={isCartOpen}
                  items={cartItems}
                  onClose={() => setIsCartOpen(false)}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<Home language={language} />} />
                    <Route
                      path="/categories"
                      element={
                        <Categories language={language} searchQuery={searchQuery} />
                      }
                    />
                    <Route
                      path="/product/:productId"
                      element={
                        <ProductDetail language={language} onAddToCart={addToCart} />
                      }
                    />
                    <Route path="/contact" element={<Contact language={language} />} />
                    <Route
                      path="/checkout"
                      element={
                        <Checkout
                          language={language}
                          cartItems={cartItems}
                          onClearCart={clearCart}
                        />
                      }
                    />
                    <Route path="/login" element={<Login language={language} />} />
                  </Routes>
                </main>
                <Footer language={language} />
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
