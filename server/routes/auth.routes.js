const express = require("express");
const router = express.Router();
const { registerUser } = require("../services/auth.service");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await registerUser({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // بدل ما تستخدم next(err) استخدم Response مباشرة
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
