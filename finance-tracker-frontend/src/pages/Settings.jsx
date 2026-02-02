import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/Dashboardlayout";
import { Globe, Palette, Bell, DollarSign, Save } from "lucide-react";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const [settings, setSettings] = useState({
    language: i18n.language,
    theme: "light",
    emailNotifications: true,
    pushNotifications: false,
    currency: "USD",
  });

  const [message, setMessage] = useState("");

  // تحميل الإعدادات المحفوظة عند تحميل الصفحة
  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);

        // تطبيق اللغة المحفوظة
        if (parsed.language) {
          i18n.changeLanguage(parsed.language);
          document.documentElement.dir =
            parsed.language === "ar" ? "rtl" : "ltr";
        }

        // تطبيق الثيم المحفوظ
        if (parsed.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    setSettings({ ...settings, language: lang });
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSave = () => {
    try {
      // حفظ الإعدادات في localStorage
      localStorage.setItem("settings", JSON.stringify(settings));

      // عرض رسالة النجاح
      setMessage(t("settings.settingsSaved"));
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("خطأ في حفظ الإعدادات");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            {t("settings.title")}
          </h1>

          {/* Success Message */}
          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-green-50 text-green-700 text-sm sm:text-base">
              {message}
            </div>
          )}

          {/* Language Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="text-blue-600" size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("settings.language")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`p-3 sm:p-4 rounded-lg border-2 transition text-sm sm:text-base ${
                  settings.language === "en"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {t("settings.english")}
                </p>
              </button>

              <button
                onClick={() => handleLanguageChange("ar")}
                className={`p-3 sm:p-4 rounded-lg border-2 transition text-sm sm:text-base ${
                  settings.language === "ar"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {t("settings.arabic")}
                </p>
              </button>

              <button
                onClick={() => handleLanguageChange("fr")}
                className={`p-3 sm:p-4 rounded-lg border-2 transition text-sm sm:text-base ${
                  settings.language === "fr"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {t("settings.french")}
                </p>
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Palette className="text-purple-600" size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("settings.theme")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-3 sm:p-4 rounded-lg border-2 transition text-sm sm:text-base ${
                  settings.theme === "light"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {t("settings.lightMode")}
                </p>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-3 sm:p-4 rounded-lg border-2 transition text-sm sm:text-base ${
                  settings.theme === "dark"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {t("settings.darkMode")}
                </p>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="text-green-600" size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("settings.notifications")}
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-700">
                  {t("settings.emailNotifications")}
                </span>
                <label className="relative inline-block w-11 h-6 sm:w-12 sm:h-6">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 sm:w-12 sm:h-6 bg-gray-300 peer-checked:bg-purple-600 rounded-full peer transition"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 sm:peer-checked:translate-x-6 transition"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-700">
                  {t("settings.pushNotifications")}
                </span>
                <label className="relative inline-block w-11 h-6 sm:w-12 sm:h-6">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 sm:w-12 sm:h-6 bg-gray-300 peer-checked:bg-purple-600 rounded-full peer transition"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 sm:peer-checked:translate-x-6 transition"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("settings.currency")}
              </h2>
            </div>

            <select
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="MRU">MRU - Ouguiya</option>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="AED">AED - UAE Dirham</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-[#6C5DD3] hover:bg-[#5b4ec4] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base"
          >
            <Save size={18} className="sm:w-5 sm:h-5" />
            {t("settings.saveSettings")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
