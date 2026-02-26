// ============================================
// UNDERWORLD LORDS - EXPRESS APPLICATION
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // للتحقق من حالة الاتصال
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/error.middleware");
const auth = require("./middlewares/auth");

const app = express();

// ----------------------------------------------------------------------
// DATABASE CONNECTION
// ----------------------------------------------------------------------
connectDB();

// ----------------------------------------------------------------------
// GLOBAL MIDDLEWARES
// ----------------------------------------------------------------------
app.use(cors());                         // تمكين CORS لجميع المسارات
app.use(express.json());                  // تحليل طلبات JSON
app.use(express.urlencoded({ extended: true })); // دعم البيانات المرسلة من النماذج (اختياري)

// ----------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------

// المصادقة (عامة)
app.use("/api/auth", authRoutes);

// مسار محمي للتجربة (يتطلب توكن)
app.use("/api/protected", auth, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    userId: req.userId
  });
});

// نقطة فحص الصحة (health check)
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// المسار الرئيسي
app.get("/", (req, res) => {
  res.json({
    name: "Underworld Lords API",
    version: "1.0.0",
    status: "running",
    documentation: "https://github.com/ztrix1/underworld-lords-game"
  });
});

// ----------------------------------------------------------------------
// 404 HANDLER - المسارات غير الموجودة
// ----------------------------------------------------------------------
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl
  });
});

// ----------------------------------------------------------------------
// GLOBAL ERROR HANDLER (يجب أن يكون في النهاية)
// ----------------------------------------------------------------------
app.use(errorHandler);

module.exports = app;