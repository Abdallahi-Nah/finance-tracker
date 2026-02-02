import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import API from '../utils/api'; 

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // حفظ بيانات المستخدم والتوكن
      const { data } = response.data;
      login({ _id: data._id, name: data.name, email: data.email }, data.token);

      // الانتقال للـ Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6C5DD3] to-[#8B7CE8] items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{t("auth.appTitle")}</h2>
            <p className="text-purple-200">{t("auth.appSubtitle")}</p>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {t("auth.leftTitle")}
          </h1>
          <p className="text-purple-200 text-lg">{t("auth.leftDescription")}</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-8">
            <select
              onChange={handleLanguageChange}
              value={i18n.language}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English (USA)</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {t("auth.welcomeBack")}
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {t("auth.loginSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("auth.email")}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("auth.password")}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="remember"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600"
                  >
                    {t("auth.rememberMe")}
                  </label>
                </div>
                <a href="#" className="text-sm text-purple-600 hover:underline">
                  {t("auth.forgotPassword")}
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C5DD3] hover:bg-[#5b4ec4] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("auth.loggingIn") : t("auth.signIn")}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">
                {t("auth.orSignInWith")}
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              {t("auth.dontHaveAccount")}{" "}
              <a
                href="/register"
                className="text-purple-600 font-semibold hover:underline"
              >
                {t("auth.signUp")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
