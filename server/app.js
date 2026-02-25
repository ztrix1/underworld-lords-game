require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Underworld Lords API running" });
});

module.exports = app;

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes (تتطلب مصادقة)
const auth = require('./middlewares/auth');
app.use('/api/protected', auth, (req, res) => {
  res.json({ message: 'You accessed a protected route!', userId: req.userId });
});
