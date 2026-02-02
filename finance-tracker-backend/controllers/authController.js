const User = require("../models/User");
const generateToken = require("../middleware/generateToken");

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق من وجود المستخدم
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    تسجيل الدخول
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود البريد وكلمة المرور
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "بيانات الدخول غير صحيحة",
      });
    }

    // التحقق من كلمة المرور
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "بيانات الدخول غير صحيحة",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    الحصول على بيانات المستخدم الحالي
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    تحديث الملف الشخصي
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: "المستخدم غير موجود",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    تغيير كلمة المرور
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    // التحقق من كلمة المرور الحالية
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "كلمة المرور الحالية غير صحيحة",
      });
    }

    // تحديث كلمة المرور
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
};
