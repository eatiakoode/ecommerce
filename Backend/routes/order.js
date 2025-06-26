const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const moment = require('moment');

// GET /api/order/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const startOfMonth = moment().startOf('month');
    const lastMonthStart = moment().subtract(1, 'months').startOf('month');
    const lastMonthEnd = moment().subtract(1, 'months').endOf('month');

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today.toDate() },
    });
    const yesterdayOrders = await Order.countDocuments({
      createdAt: {
        $gte: yesterday.toDate(),
        $lt: today.toDate(),
      },
    });
    const thisMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth.toDate() },
    });
    const lastMonthOrders = await Order.countDocuments({
      createdAt: {
        $gte: lastMonthStart.toDate(),
        $lt: lastMonthEnd.toDate(),
      },
    });

    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPriceAfterDiscount" },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    res.json({
      totalOrders,
      todayOrders,
      yesterdayOrders,
      thisMonthOrders,
      lastMonthOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/order/todayorders
router.get('/todayorders', async (req, res) => {
  try {
    const today = moment().startOf('day');
    const orders = await Order.find({ createdAt: { $gte: today.toDate() } }).populate('user');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/order/yesterdayorders
router.get('/yesterdayorders', async (req, res) => {
  try {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const orders = await Order.find({
      createdAt: { $gte: yesterday.toDate(), $lt: today.toDate() },
    }).populate('user');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/order/monthly-revenue
router.get('/monthly-revenue', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: "$totalPriceAfterDiscount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
