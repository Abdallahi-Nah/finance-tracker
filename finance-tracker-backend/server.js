const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const statsRoutes = require("./routes/statsRoutes");

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);

// Route تجريبي
app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running..." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
