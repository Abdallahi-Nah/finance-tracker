import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/Dashboardlayout";
import API from "../utils/api";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#6C5DD3",
  });

  const colorOptions = [
    "#6C5DD3",
    "#FF6B6B",
    "#4ECDC4",
    "#FFA07A",
    "#98D8C8",
    "#FFD93D",
    "#6BCF7F",
    "#C77DFF",
    "#FF8FA3",
    "#70D6FF",
  ];

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      let url = "/categories";
      if (searchTerm) url += `?search=${searchTerm}`;

      const response = await API.get(url);
      setCategories(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await API.post("/categories", formData);
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.error || "Error saving category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("categories.deleteConfirm"))) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      color: "#6C5DD3",
    });
    setEditingCategory(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("categories.title")}
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-[#6C5DD3] hover:bg-[#5b4ec4] text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <Plus size={20} />
            <span>{t("categories.addNew")}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md mb-6">
        <div className="relative">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 -translate-y-1/2 text-gray-400`}
            size={20}
          />
          <input
            type="text"
            placeholder={t("categories.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {t("categories.noCategories")}
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              {/* Color Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    category.type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t(`categories.${category.type}`)}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {category.name}
              </h3>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition"
                >
                  <Edit2 size={16} />
                  <span className="text-sm">{t("categories.edit")}</span>
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">{t("categories.delete")}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory
                  ? t("categories.editCategory")
                  : t("categories.addCategory")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("categories.name")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("categories.enterName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("categories.type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="income">{t("categories.income")}</option>
                  <option value="expense">{t("categories.expense")}</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("categories.color")}
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-12 h-12 rounded-full border-4 transition ${
                        formData.color === color
                          ? "border-gray-800 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t("categories.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5b4ec4]"
                >
                  {t("categories.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
