const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // الحصول على التوكن من الـ Header
      token = req.headers.authorization.split(" ")[1];

      // التحقق من التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // الحصول على بيانات المستخدم من قاعدة البيانات
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        error: "غير مصرح لك بالدخول - التوكن غير صالح",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "غير مصرح لك بالدخول - لا يوجد توكن",
    });
  }
};

module.exports = { protect };
