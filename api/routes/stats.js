const express = require("express");
const connectDB = require("../lib/db");
const Order = require("../models/Order");
const { requireAdmin } = require("../lib/auth");

const router = express.Router();

// GET /api/stats — revenue + order statistics (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of week (Sunday)
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalOrders,
      totalRevenueAgg,
      ordersThisWeek,
      ordersThisMonth,
      ordersThisYear,
      revenueThisWeek,
      revenueThisMonth,
      revenueThisYear,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfYear } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "confirmed" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      ordersThisWeek,
      ordersThisMonth,
      ordersThisYear,
      revenueThisWeek: revenueThisWeek[0]?.total || 0,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      revenueThisYear: revenueThisYear[0]?.total || 0,
      statusBreakdown: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      recentOrders,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
