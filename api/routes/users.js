const express = require("express");
const connectDB = require("../lib/db");
const User = require("../models/User");
const Order = require("../models/Order");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

// GET /api/users — list all users (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const users = await User.find({ role: "user" })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    // Attach order counts
    const usersWithOrders = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ userId: u._id });
        return { ...u, orderCount };
      })
    );

    res.json({ users: usersWithOrders });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/:id — get user details + orders (admin only)
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.params.id).select("-passwordHash").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    res.json({ user, orders });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
