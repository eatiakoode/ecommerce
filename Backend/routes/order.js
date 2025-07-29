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
router.get("/single/:id",authMiddleware,isAdmin, getOrder);
 
router.get("/dashboard",authMiddleware,isAdmin, getOrderDashboard);

// Time-based orders
router.get("/todayorders",authMiddleware,isAdmin, getTodayOrders);
router.get("/yesterdayorders",authMiddleware,isAdmin, getYesterdayOrders);
router.get("/thisMonth",authMiddleware,isAdmin, getThisMonth);
router.get("/lastMonth",authMiddleware,isAdmin, getLastMonth);
router.get("/allTimeSales",authMiddleware,isAdmin, getAllTimeSales);

// Order status summary
router.get("/statuscounts",authMiddleware,isAdmin, getOrderStatusCounts);

// Order lists by status
router.get("/pending",authMiddleware,isAdmin, getOrdersPending);
router.get("/processing",authMiddleware,isAdmin, getOrdersProcessing);
router.get("/delivered",authMiddleware,isAdmin, getOrdersDelivered);

// Monthly sales for chart/table
router.get("/monthly-sales",authMiddleware,isAdmin, getMonthlySales);
router.get("/best-sellers",authMiddleware,isAdmin, getBestSellers);


router.get("/recent", authMiddleware, isAdmin, getRecentOrders);
router.put("/status/:id",authMiddleware,isAdmin, updateOrderStatus);

module.exports = router;
