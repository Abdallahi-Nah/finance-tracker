const Category = require("../models/Category");

// @desc    إنشاء تصنيف جديد
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    const category = await Category.create({
      name,
      type,
      color,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الحصول على جميع التصنيفات
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const { type, search } = req.query;

    // بناء الفلترة
    let filter = { userId: req.user._id };

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الحصول على تصنيف واحد
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود",
      });
    }

    // التحقق من أن التصنيف يخص المستخدم الحالي
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بالوصول لهذا التصنيف",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    تحديث تصنيف
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود",
      });
    }

    // التحقق من أن التصنيف يخص المستخدم الحالي
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بتعديل هذا التصنيف",
      });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    حذف تصنيف
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود",
      });
    }

    // التحقق من أن التصنيف يخص المستخدم الحالي
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بحذف هذا التصنيف",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "تم حذف التصنيف بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
