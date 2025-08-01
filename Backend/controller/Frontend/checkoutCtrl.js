const asyncHandler = require("express-async-handler");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");

const generateInvoiceNo = () => Math.floor(100000 + Math.random() * 900000);

const checkoutCOD = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    firstname,
    lastname,
    address,
    city,
    state,
    other,
    pincode,
  } = req.body;

  const cartItems = await Cart.find({ userId })
    .populate("productId", "sellingPrice title")
    .populate("color", "title")
    .populate("size", "name");

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalPrice = 0;
  const orderItems = cartItems.map((item) => {
    const productPrice = item.productId.sellingPrice;
    const itemTotal = item.quantity * productPrice;
    totalPrice += itemTotal;

    return {
      product: item.productId._id,
      color: item.color?._id || null,
      size: item.size?._id || null,
      quantity: item.quantity,
      price: productPrice,
    };
  });

  const totalPriceAfterDiscount = totalPrice;

  const order = await Order.create({
    invoiceNo: generateInvoiceNo(),
    orderTime: new Date(),
    customerName: `${firstname} ${lastname}`,
    paymentMethod: "Cash",
    amount: totalPriceAfterDiscount,
    totalPrice,
    totalPriceAfterDiscount,
    paidAt: null,
    month: new Date().getMonth() + 1,
    user: userId,
    shippingInfo: {
      firstname,
      lastname,
      address,
      city,
      state,
      other,
      pincode,
    },
    paymentInfo: {}, // empty for COD
    orderItems,
    orderStatus: "Ordered",
    status: "Ordered",
  });

  // Step 4: Clear Cart
  await Cart.deleteMany({ userId });

  // Step 5: Response
  res.status(201).json({
    success: true,
    message: "Order placed successfully using Cash on Delivery.",
    orderId: order._id,
    invoiceNo: order.invoiceNo,
  });
});

module.exports = { checkoutCOD };