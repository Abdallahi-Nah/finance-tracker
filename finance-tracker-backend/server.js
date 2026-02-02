const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const statsRoutes = require("./routes/statsRoutes");

// Load environment variables
dotenv.config();

const app = express();

// CORS - MUST BE BEFORE ROUTES
app.use(
  cors({
    origin: [
      "https://finance-tracker-6gsg.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Connect to database (non-blocking for serverless)
connectDB().catch((err) => console.error("DB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running..." });
});

// IMPORTANT: Only listen in development, NOT production
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });
}

// CRITICAL FOR VERCEL: Export the app
module.exports = app;
