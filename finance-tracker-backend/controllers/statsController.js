const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

// @desc    الحصول على الإحصائيات العامة
// @route   GET /api/stats/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // بناء الفلترة
    let filter = { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // حساب إجمالي الدخل
    const incomeResult = await Transaction.aggregate([
      { $match: { ...filter, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    // حساب إجمالي المصروفات
    const expenseResult = await Transaction.aggregate([
      { $match: { ...filter, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;

    // حساب الرصيد
    const balance = totalIncome - totalExpense;

    // عدد المعاملات
    const transactionsCount = await Transaction.countDocuments(filter);

    // عدد التصنيفات
    const categoriesCount = await Category.countDocuments({
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        transactionsCount,
        categoriesCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    المصروفات حسب التصنيف
// @route   GET /api/stats/expenses-by-category
// @access  Private
const getExpensesByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // بناء الفلترة
    let matchFilter = { userId: req.user._id, type: "expense" };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) {
        matchFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchFilter.date.$lte = new Date(endDate);
      }
    }

    const expensesByCategory = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$categoryId",
          category: { $first: "$category.name" },
          color: { $first: "$category.color" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: expensesByCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الدخل والمصروفات الشهرية
// @route   GET /api/stats/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    // حساب تاريخ البداية (قبل X أشهر)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const filter = {
      userId: req.user._id,
      date: { $gte: startDate },
    };

    const monthlySummary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // تنظيم البيانات
    const organizedData = {};

    monthlySummary.forEach((item) => {
      const monthKey = `${item._id.year}-${String(item._id.month).padStart(
        2,
        "0"
      )}`;

      if (!organizedData[monthKey]) {
        organizedData[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
        };
      }

      if (item._id.type === "income") {
        organizedData[monthKey].income = item.total;
      } else {
        organizedData[monthKey].expense = item.total;
      }
    });

    // تحويل Object إلى Array
    const result = Object.values(organizedData);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getOverview,
  getExpensesByCategory,
  getMonthlySummary,
};
