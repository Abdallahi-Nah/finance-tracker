const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "الرجاء إدخال المبلغ"],
      min: [0, "المبلغ يجب أن يكون أكبر من صفر"],
    },
    type: {
      type: String,
      required: [true, "الرجاء تحديد نوع المعاملة"],
      enum: {
        values: ["income", "expense"],
        message: "النوع يجب أن يكون income أو expense",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "الرجاء تحديد التصنيف"],
    },
    date: {
      type: Date,
      required: [true, "الرجاء إدخال التاريخ"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
