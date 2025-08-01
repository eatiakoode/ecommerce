const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  removeFromWishlist,
  emptyWishlist,
  saveAddress,
  userCart,
  getUserCart,

  createOrder,

  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  getMyOrderDetails,
  emptyCart,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getYearlyTotalOrder,
  getAllOrders,
  getsingleOrder,
  updateOrder,
  addToWishlist,
  getCurrentUser,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");

const router = express.Router();

// Public routes
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);

// Protected routes - specific routes first
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getmyorder/:id", authMiddleware, getMyOrderDetails);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isAdmin, getsingleOrder);
router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getyearlyorders", authMiddleware, getYearlyTotalOrder);
router.get("/profile", authMiddleware, getCurrentUser);

// Cart routes
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity", authMiddleware, updateProductQuantityFromCart);
router.delete("/empty-cart", authMiddleware, emptyCart);

// Order routes
router.post("/cart/create-order", authMiddleware, createOrder);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentVerification);
router.put("/updateOrder/:id", authMiddleware, isAdmin, updateOrder);

// Wishlist routes
router.post("/wishlist", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlist);
router.delete("/wishlist/:wishlistItemId", authMiddleware, removeFromWishlist);
router.delete("/wishlist", authMiddleware, emptyWishlist);

// User management routes
router.put("/password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

// Auth routes
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

// Admin routes - general routes last
router.get("/all-users", getallUser);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);

module.exports = router;