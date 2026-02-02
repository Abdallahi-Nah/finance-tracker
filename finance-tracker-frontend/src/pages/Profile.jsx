import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/Dashboardlayout";
import API from "../utils/api";
import { User, Lock, Save } from "lucide-react";

const Profile = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await API.put("/auth/profile", profileData);
      const updatedUser = response.data.data;

      // تحديث Context
      login(updatedUser, user.token);

      setMessage(t("profile.updateSuccess"));
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.put("/auth/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage(t("profile.passwordSuccess"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {t("profile.title")}
        </h1>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success") || message.includes("بنجاح")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("profile.personalInfo")}
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.name")}
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.email")}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#6C5DD3] hover:bg-[#5b4ec4] text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              <Save size={20} />
              {t("profile.save")}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("profile.changePassword")}
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.currentPassword")}
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.newPassword")}
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.confirmPassword")}
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              <Lock size={20} />
              {t("profile.changePassword")}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
