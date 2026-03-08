const express = require("express");
const connectDB = require("../lib/db");
const Product = require("../models/Product");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

// GET /api/products — get all products (public, used by storefront and admin)
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ products });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/products — create a new product (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// PUT /api/products/:id — update a product (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/products/:id — delete a product (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
