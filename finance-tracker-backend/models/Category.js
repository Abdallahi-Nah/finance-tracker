const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال اسم التصنيف"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "الرجاء تحديد نوع التصنيف"],
      enum: {
        values: ["income", "expense"],
        message: "النوع يجب أن يكون income أو expense",
      },
    },
    color: {
      type: String,
      default: "#4CAF50",
      trim: true,
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

module.exports = mongoose.model("Category", categorySchema);
