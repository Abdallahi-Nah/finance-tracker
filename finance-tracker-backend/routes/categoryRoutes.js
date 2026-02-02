const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createCategory).get(protect, getCategories);

router
  .route("/:id")
  .get(protect, getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
