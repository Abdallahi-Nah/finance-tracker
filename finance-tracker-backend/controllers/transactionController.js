const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

// @desc    إنشاء معاملة جديدة
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { amount, type, categoryId, date, note } = req.body;

    // التحقق من وجود التصنيف
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود",
      });
    }

    // التحقق من أن التصنيف يخص المستخدم
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك باستخدام هذا التصنيف",
      });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      categoryId,
      date,
      note,
      userId: req.user._id,
    });

    // إرجاع المعاملة مع بيانات التصنيف
    const populatedTransaction = await Transaction.findById(
      transaction._id
    ).populate("categoryId", "name color type");

    res.status(201).json({
      success: true,
      data: populatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الحصول على جميع المعاملات
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      search,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // بناء الفلترة
    let filter = { userId: req.user._id };

    if (type) {
      filter.type = type;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.note = { $regex: search, $options: "i" };
    }

    // الترتيب
    const sortBy = sort || "-date";

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(filter)
      .populate("categoryId", "name color type")
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
      },
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الحصول على معاملة واحدة
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "categoryId",
      "name color type"
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "المعاملة غير موجودة",
      });
    }

    // التحقق من أن المعاملة تخص المستخدم الحالي
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بالوصول لهذه المعاملة",
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    تحديث معاملة
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "المعاملة غير موجودة",
      });
    }

    // التحقق من أن المعاملة تخص المستخدم الحالي
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بتعديل هذه المعاملة",
      });
    }

    // إذا تم تغيير التصنيف، تحقق من أنه يخص المستخدم
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);

      if (!category || category.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          error: "التصنيف غير صالح",
        });
      }
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name color type");

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    حذف معاملة
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "المعاملة غير موجودة",
      });
    }

    // التحقق من أن المعاملة تخص المستخدم الحالي
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بحذف هذه المعاملة",
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "تم حذف المعاملة بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
