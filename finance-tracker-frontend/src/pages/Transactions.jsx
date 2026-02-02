import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/Dashboardlayout";
import API from "../utils/api";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

const Transactions = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filterType, filterCategory, searchTerm]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = "/transactions?limit=100";
      if (filterType) url += `&type=${filterType}`;
      if (filterCategory) url += `&categoryId=${filterCategory}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await API.get(url);
      setTransactions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction._id}`, formData);
      } else {
        await API.post("/transactions", formData);
      }
      setShowModal(false);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert(error.response?.data?.error || "Error saving transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId._id,
      date: transaction.date.split("T")[0],
      note: transaction.note || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("transactions.deleteConfirm"))) {
      try {
        await API.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      type: "expense",
      categoryId: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setEditingTransaction(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              {t("transactions.title")}
            </h1>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-[#6C5DD3] hover:bg-[#5b4ec4] text-white px-4 py-2.5 sm:py-2 rounded-lg transition cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus size={20} />
              <span>{t("transactions.addNew")}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 -translate-y-1/2 text-gray-400`}
                size={20}
              />
              <input
                type="text"
                placeholder={t("transactions.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${
                  isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="">{t("transactions.all")}</option>
              <option value="income">{t("transactions.income")}</option>
              <option value="expense">{t("transactions.expense")}</option>
            </select>

            {/* Filter by Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base sm:col-span-2 lg:col-span-1"
            >
              <option value="">{t("transactions.all")}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs sm:text-sm text-gray-600">
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.date")}
                  </th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.type")}
                  </th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.category")}
                  </th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.amount")}
                  </th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.note")}
                  </th>
                  <th className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                    {t("transactions.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 sm:py-12">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-purple-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base"
                    >
                      {t("transactions.noTransactions")}
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t(`transactions.${transaction.type}`)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 text-xs sm:text-sm whitespace-nowrap">
                        {transaction.categoryId?.name || "-"}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 text-xs sm:text-sm text-gray-600 max-w-[150px] sm:max-w-[200px] truncate">
                        {transaction.note || "-"}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 whitespace-nowrap">
                        <div className="flex gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                            aria-label="Edit"
                          >
                            <Edit2
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingTransaction
                  ? t("transactions.editTransaction")
                  : t("transactions.addTransaction")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Type */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  {t("transactions.type")}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                >
                  <option value="income">{t("transactions.income")}</option>
                  <option value="expense">{t("transactions.expense")}</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  {t("transactions.category")}
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                >
                  <option value="">{t("transactions.selectCategory")}</option>
                  {categories
                    .filter((cat) => cat.type === formData.type)
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  {t("transactions.amount")}
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder={t("transactions.enterAmount")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  {t("transactions.date")}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  {t("transactions.note")}
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder={t("transactions.enterNote")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base resize-none"
                  rows="3"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  {t("transactions.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5b4ec4] transition-colors text-sm sm:text-base"
                >
                  {t("transactions.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Transactions;
