import { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // استرجاع التوكن والمستخدم من Cookies مباشرة عند التهيئة
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // تسجيل الدخول
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    // حفظ في Cookies مع خيارات أمان
    Cookies.set("token", userToken, {
      expires: 30, // 30 يوم
      secure: true, // فقط عبر HTTPS
      sameSite: "strict", // حماية من CSRF
    });
    Cookies.set("user", JSON.stringify(userData), {
      expires: 30,
      secure: true,
      sameSite: "strict",
    });
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
