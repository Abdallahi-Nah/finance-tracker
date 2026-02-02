import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const isRTL = i18n.language === "ar";

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("sidebar.dashboard"),
      path: "/dashboard",
    },
    { icon: Tag, label: t("sidebar.categories"), path: "/categories" },
    {
      icon: ArrowLeftRight,
      label: t("sidebar.transactions"),
      path: "/transactions",
    },
    { icon: User, label: t("sidebar.profile"), path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // إغلاق القائمة بعد الانتقال في الموبايل
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay للموبايل */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`
          w-64 bg-white h-screen fixed top-0 shadow-lg flex flex-col z-50 transition-transform duration-300
          ${isRTL ? "right-0" : "left-0"}
          ${
            isOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Close Button (للموبايل فقط) */}
        <button
          onClick={onClose}
          className={`lg:hidden absolute top-4 ${
            isRTL ? "left-4" : "right-4"
          } text-gray-600 hover:text-gray-800`}
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-3`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#6C5DD3] to-[#8B7CE8] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 ms-4">FinSet</h1>
              <p className="text-xs text-gray-500 ms-4">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center cursor-pointer ${
                      isRTL ? "space-x-reverse" : ""
                    } space-x-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? "bg-[#6C5DD3] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium ms-1">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center cursor-pointer ${
              isRTL ? "space-x-reverse" : ""
            } space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all`}
          >
            <LogOut size={20} />
            <span className="font-medium ms-2">{t("sidebar.logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
