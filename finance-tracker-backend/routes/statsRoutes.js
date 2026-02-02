const express = require("express");
const {
  getOverview,
  getExpensesByCategory,
  getMonthlySummary,
} = require("../controllers/statsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/overview", protect, getOverview);
router.get("/expenses-by-category", protect, getExpensesByCategory);
router.get("/monthly-summary", protect, getMonthlySummary);

module.exports = router;
