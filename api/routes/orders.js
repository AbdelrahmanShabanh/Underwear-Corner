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

    const mongoose = require("mongoose");
    const Product = require("../models/Product");

    for (const item of items) {
      if (!item.productId) continue;
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
        } else {
          product.stock = 0;
        }

        if (product.sizes && product.sizes.length > 0 && item.size) {
          const sizeObj = product.sizes.find(s => s.name === item.size);
          if (sizeObj) {
            if (sizeObj.stock >= item.quantity) {
              sizeObj.stock -= item.quantity;
            } else {
              sizeObj.stock = 0;
            }
          }
        }
        await product.save();
      }
    }

    res.status(201).json({ order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/orders/draft — create a draft order (public)
router.post("/draft", async (req, res) => {
  try {
    await connectDB();
    const { items, total, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await Order.create({
      items,
      total: total || 0,
      status: "draft",
      userId: userId || null,
      paymentMethod: "cash",
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error("Create draft error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders/:id — get single order (public for draft/checkout, but mostly admin)
router.get("/:id", async (req, res) => {
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

// GET /api/orders — list all orders (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    // Exclude drafts from admin list
    const orders = await Order.find({ status: { $ne: "draft" } }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id/confirm — finalize a draft order (public)
router.put("/:id/confirm", async (req, res) => {
  try {
    await connectDB();
    const { customer, total, paymentMethod } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order || order.status !== "draft") {
      return res.status(400).json({ error: "Invalid draft order" });
    }

    order.customer = customer;
    order.total = total;
    order.paymentMethod = paymentMethod || "cash";
    order.status = "pending";

    // Deduct stock
    const mongoose = require("mongoose");
    const Product = require("../models/Product");

    for (const item of order.items) {
      if (!item.productId) continue;
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
        } else {
          product.stock = 0;
        }

        if (product.sizes && product.sizes.length > 0 && item.size) {
          const sizeObj = product.sizes.find(s => s.name === item.size);
          if (sizeObj) {
            if (sizeObj.stock >= item.quantity) {
              sizeObj.stock -= item.quantity;
            } else {
              sizeObj.stock = 0;
            }
          }
        }
        await product.save();
      }
    }

    await order.save();
    res.json({ order });
  } catch (err) {
    console.error("Confirm order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/orders/all — delete all orders (admin only)
router.delete("/all", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    await Order.deleteMany({});
    res.json({ message: "All orders deleted successfully" });
  } catch (err) {
    console.error("Delete all orders error:", err);
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
