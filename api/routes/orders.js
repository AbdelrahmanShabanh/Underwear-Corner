const express = require("express");
const connectDB = require("../lib/db");
const Order = require("../models/Order");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

// POST /api/orders — place a new order (public)
router.post("/", async (req, res) => {
  try {
    await connectDB();
    const { customer, items, total, paymentMethod, userId } = req.body;

    if (!customer || !items || items.length === 0 || total == null) {
      return res.status(400).json({ error: "Missing required order data" });
    }

    const order = await Order.create({
      customer,
      items,
      total,
      paymentMethod: paymentMethod || "cash",
      status: "pending",
      userId: userId || null,
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders — list all orders (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders/:id — get single order (admin only)
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/orders/:id/status — change order status (admin only)
router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
