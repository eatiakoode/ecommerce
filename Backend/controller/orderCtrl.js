const Order = require("../models/orderModel"); 
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const validateMongoDbId = require("../utils/validateMongodbId");

// GET /api/order/dashboard
const getOrderDashboard = asyncHandler(async (req, res) => {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  const startOfMonth = moment().startOf("month");
  const lastMonthStart = moment().subtract(1, "months").startOf("month");
  const lastMonthEnd = moment().subtract(1, "months").endOf("month");

  const [totalOrders, todayOrders, yesterdayOrders, thisMonth, lastMonth] =
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today.toDate() } }),
      Order.countDocuments({
        createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() },
      }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth.toDate() } }),
      Order.countDocuments({
        createdAt: { $gte: lastMonthStart.toDate(), $lt: lastMonthEnd.toDate() },
      }),
    ]);

  const revenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        getAllTimeSales: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);

  res.json({
    totalOrders,
    todayOrders,
    yesterdayOrders,
    thisMonth,
    lastMonth,
    getAllTimeSales: revenue[0]?.getAllTimeSales || 0,
  });
});

const getTodayOrders = asyncHandler(async (req, res) => {
  const today = moment().startOf("day");
  const orders = await Order.find({ createdAt: { $gte: today.toDate() } }).populate("user");
  res.json(orders);
});

const getYesterdayOrders = asyncHandler(async (req, res) => {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  const orders = await Order.find({
    createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() },
  }).populate("user");
  res.json(orders);
});

const getThisMonth = asyncHandler(async (req, res) => {
  const startOfMonth = moment().startOf("month");
  const orders = await Order.find({ createdAt: { $gte: startOfMonth.toDate() } }).populate("user");
  res.json(orders);
});

const getLastMonth = asyncHandler(async (req, res) => {
  const lastMonthStart = moment().subtract(1, "months").startOf("month");
  const lastMonthEnd = moment().subtract(1, "months").endOf("month");
  const orders = await Order.find({
    createdAt: { $gte: lastMonthStart.toDate(), $lt: lastMonthEnd.toDate() },
  }).populate("user");
  res.json(orders);
});

const getAllTimeSales = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json(orders);
});

const getOrderStatusCounts = asyncHandler(async (req, res) => {
  const statuses = ["Pending", "Processing", "Delivered"];
  const counts = await Promise.all(
    statuses.map((status) => Order.countDocuments({ orderStatus: status }))
  );
  res.json({
    Pending: counts[0],
    Processing: counts[1],
    Delivered: counts[2],
  });
});

const getOrdersPending = asyncHandler(async (req, res) => {
  const orders = await Order.find({ orderStatus: "Pending" }).populate("user");
  res.json(orders);
});

const getOrdersProcessing = asyncHandler(async (req, res) => {
  const orders = await Order.find({ orderStatus: "Processing" }).populate("user");
  res.json(orders);
});

const getOrdersDelivered = asyncHandler(async (req, res) => {
  const orders = await Order.find({ orderStatus: "Delivered" }).populate("user");
  res.json(orders);
});

const getMonthlySales = asyncHandler(async (req, res) => {
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$totalPriceAfterDiscount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalSales: 0,
    totalOrders: 0,
  }));

  salesData.forEach((item) => {
    months[item._id - 1] = {
      month: item._id,
      totalSales: item.totalSales,
      totalOrders: item.totalOrders,
    };
  });

  res.json(months);
});

const getBestSellers = asyncHandler(async (req, res) => {
  const bestSellers = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 4 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $project: {
        _id: 0,
        productId: "$productInfo._id",
        name: "$productInfo.title",
        totalSold: 1,
      },
    },
  ]);

  res.json(bestSellers);
});


const getRecentOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const total = await Order.countDocuments();
  const pages = Math.ceil(total / perPage);
  const skip = (page - 1) * perPage;

  const orders = await Order.find()
    .populate("user", "firstname lastname email") 
    .populate("orderItems.product", "title brand") 
    .populate("orderItems.color", "title") 
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(perPage)
    .lean();

  res.status(200).json({
    data: orders,
    total,
    pages,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate MongoDB ObjectId
  validateMongoDbId(id);

  // Validate status value
  const allowedStatuses = ["Ordered", "Pending", "Processing", "Delivered", "Cancelled", "Failed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: status,
      orderStatus: status, // keeping both in sync
    },
    { new: true }
  );

  if (!updatedOrder) {
    return res.status(404).json({ message: "Order not found." });
  }

  res.status(200).json(updatedOrder);
});

// ✅ GET SINGLE ORDER BY ID
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

module.exports = {
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
};