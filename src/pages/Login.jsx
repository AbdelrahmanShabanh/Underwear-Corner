import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = ({ language }) => {
  const isRtl = language === "ar";
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (mode === "register") {
        if (!form.name.trim()) {
          setError(isRtl ? "الاسم مطلوب" : "Name is required");
          setLoading(false);
          return;
        }
        user = await register(form.name, form.email, form.password);
      } else {
        user = await login(form.email, form.password);
      }

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.error || (isRtl ? "حدث خطأ" : "Something went wrong");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" dir={isRtl ? "rtl" : "ltr"}>
      <div className="login-card">
        <div className="login-logo">
          <i className="fa-solid fa-user-shield" />
        </div>
        <h1 className="login-title">
          {mode === "login"
            ? isRtl ? "تسجيل الدخول" : "Sign In"
            : isRtl ? "إنشاء حساب" : "Create Account"}
        </h1>
        <p className="login-subtitle">
          {isRtl ? "مرحباً بك في Underwear Corner" : "Welcome to Underwear Corner"}
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <div className="login-field">
              <label>{isRtl ? "الاسم" : "Name"}</label>
              <input
                type="text"
                placeholder={isRtl ? "اسمك الكامل" : "Your full name"}
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>
          )}

          <div className="login-field">
            <label>{isRtl ? "البريد الإلكتروني" : "Email"}</label>
            <input
              type="email"
              placeholder={isRtl ? "example@mail.com" : "you@email.com"}
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          <div className="login-field">
            <label>{isRtl ? "كلمة المرور" : "Password"}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : mode === "login" ? (
              isRtl ? "دخول" : "Sign In"
            ) : (
              isRtl ? "إنشاء حساب" : "Sign Up"
            )}
          </button>
        </form>

        <div className="login-toggle">
          {mode === "login" ? (
            <p>
              {isRtl ? "ليس لديك حساب؟ " : "Don't have an account? "}
              <button type="button" onClick={() => { setMode("register"); setError(""); }}>
                {isRtl ? "سجل الآن" : "Sign Up"}
              </button>
            </p>
          ) : (
            <p>
              {isRtl ? "لديك حساب؟ " : "Already have an account? "}
              <button type="button" onClick={() => { setMode("login"); setError(""); }}>
                {isRtl ? "سجل دخول" : "Sign In"}
              </button>
            </p>
          )}
        </div>

        <Link to="/" className="login-back-link">
          <i className="fa-solid fa-arrow-left" />
          {" "}
          {isRtl ? "العودة للتسوق" : "Back to Shopping"}
        </Link>
      </div>
    </div>
  );
};

export default Login;
