const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, createTransaction)
  .get(protect, getTransactions);

router
  .route("/:id")
  .get(protect, getTransaction)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
