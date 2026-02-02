import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/Dashboardlayout";
import API from "../utils/api";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [stats, setStats] = useState(null);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // جلب الإحصائيات العامة
      const statsRes = await API.get("/stats/overview");
      setStats(statsRes.data.data);

      // جلب المصروفات حسب الفئة
      const expensesRes = await API.get("/stats/expenses-by-category");
      setExpensesByCategory(expensesRes.data.data);

      // جلب الملخص الشهري
      const monthlyRes = await API.get("/stats/monthly-summary?months=6");
      setMonthlySummary(monthlyRes.data.data);

      // جلب آخر 5 معاملات
      const transactionsRes = await API.get("/transactions?limit=5");
      setRecentTransactions(transactionsRes.data.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const COLORS = [
    "#6C5DD3",
    "#FF6B6B",
    "#4ECDC4",
    "#FFA07A",
    "#98D8C8",
    "#FFD93D",
    "#95E1D3",
  ];

  // Stat cards configuration
  const statCards = [
    {
      title: t("dashboard.totalBalance"),
      value: stats?.balance,
      icon: Wallet,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: t("dashboard.income"),
      value: stats?.totalIncome,
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+6.4%",
      trendUp: true,
    },
    {
      title: t("dashboard.expense"),
      value: stats?.totalExpense,
      icon: TrendingDown,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      trend: "-3.2%",
      trendUp: false,
    },
    {
      title: t("dashboard.totalSavings"),
      value: stats?.balance,
      icon: PiggyBank,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+12.1%",
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("dashboard.welcome")}, {user?.name}!
        </h1>
        <div
          className={`flex items-center text-gray-500 text-sm md:text-base ${
            isRTL ? "space-x-reverse" : ""
          } space-x-2`}
        >
          <Calendar size={16} />
          <span className="ms-2">{t("dashboard.thisMonth")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className="text-gray-500 text-xs md:text-sm font-medium">
                  {card.title}
                </p>
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 ${card.bgColor} rounded-full flex items-center justify-center`}
                >
                  <Icon className={card.iconColor} size={18} />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                ${card.value?.toLocaleString() || 0}
              </h3>
              <div
                className={`flex items-center text-xs md:text-sm ${
                  isRTL ? "space-x-reverse" : ""
                } space-x-1`}
              >
                {card.trendUp ? (
                  <TrendingUp size={14} className="text-green-500" />
                ) : (
                  <TrendingDown size={14} className="text-red-500" />
                )}
                <span
                  className={card.trendUp ? "text-green-500" : "text-red-500"}
                >
                  {card.trend} {t("dashboard.lastMonth")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Money Flow Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              {t("dashboard.moneyFlow")}
            </h3>
            <select className="text-xs md:text-sm border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto">
              <option>{t("dashboard.allAccounts")}</option>
            </select>
          </div>
          <div className="w-full h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySummary}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  interval={"preserveStartEnd"}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                <Bar
                  dataKey="income"
                  fill="#6C5DD3"
                  name={t("dashboard.income")}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill="#FF6B6B"
                  name={t("dashboard.expense")}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Pie Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">
            {t("dashboard.budget")}
          </h3>
          <div className="w-full h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => {
                    const name =
                      entry.category?.length > 10
                        ? entry.category.substring(0, 10) + "..."
                        : entry.category;
                    return name;
                  }}
                  outerRadius={window.innerWidth < 768 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend for mobile */}
          {expensesByCategory.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {expensesByCategory.slice(0, 6).map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600 truncate">
                    {entry.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            {t("dashboard.recentTransactions")}
          </h3>
          <button
            onClick={() => navigate("/transactions")}
            className="text-purple-600 hover:text-purple-700 text-xs md:text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {t("dashboard.seeAll")}
            <Eye size={14} />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">{t("dashboard.date")}</th>
                <th className="pb-3 font-medium">{t("dashboard.amount")}</th>
                <th className="pb-3 font-medium">
                  {t("dashboard.paymentName")}
                </th>
                <th className="pb-3 font-medium">{t("dashboard.category")}</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString(
                      i18n.language === "ar"
                        ? "ar-EG"
                        : i18n.language === "fr"
                        ? "fr-FR"
                        : "en-US"
                    )}
                  </td>
                  <td className="py-4">
                    <span
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-800">
                    {transaction.note || "-"}
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {transaction.categoryId?.name || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">
              {t("dashboard.noTransactions")}
            </p>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {transaction.note || t("dashboard.noDescription")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString(
                      i18n.language === "ar"
                        ? "ar-EG"
                        : i18n.language === "fr"
                        ? "fr-FR"
                        : "en-US"
                    )}
                  </p>
                </div>
                <span
                  className={`text-base font-bold flex-shrink-0 ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  } ${isRTL ? "mr-2" : "ml-2"}`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </span>
              </div>
              <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {transaction.categoryId?.name || "-"}
              </span>
            </div>
          ))}

          {recentTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {t("dashboard.noTransactions")}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
