const express = require("express");
const router = express.Router();

const {
  getOrderDashboard,
  getTodayOrders,
  getYesterdayOrders,
  getThisMonth,
  getLastMonth,
  getAllTimeSales,
  getOrderStatusCounts,
  getOrdersPending,
  getOrdersProcessing,
  getOrdersDelivered,
  getMonthlySales,
  getBestSellers,
  getRecentOrders,
  updateOrderStatus,
  getOrder
} = require("../controller/orderCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Main dashboard stats
// ✅ Create Order
router.get("/single/:id", getOrder);
 
router.get("/dashboard", getOrderDashboard);

// Time-based orders
router.get("/todayorders", getTodayOrders);
router.get("/yesterdayorders", getYesterdayOrders);
router.get("/thisMonth", getThisMonth);
router.get("/lastMonth", getLastMonth);
router.get("/allTimeSales", getAllTimeSales);

// Order status summary
router.get("/statuscounts", getOrderStatusCounts);

// Order lists by status
router.get("/pending", getOrdersPending);
router.get("/processing", getOrdersProcessing);
router.get("/delivered", getOrdersDelivered);

// Monthly sales for chart/table
router.get("/monthly-sales", getMonthlySales);
router.get("/best-sellers", getBestSellers);


router.get("/recent", authMiddleware, isAdmin, getRecentOrders);
router.put("/status/:id", updateOrderStatus);

module.exports = router;
