import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import LanguageSwitcher from "./Languageswitcher";

const DashboardLayout = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 lg:ms-64">
        {/* Header للموبايل فقط - يحتوي على زر القائمة ومبدل اللغة */}
        <div className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">FinSet</h2>

            <LanguageSwitcher />
          </div>
        </div>

        {/* Language Switcher for Desktop */}
        <div className="hidden lg:flex justify-end p-4 bg-white border-b border-gray-200">
          <LanguageSwitcher />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
