const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
//const sendEmail = require("../util/sendEmail");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) throw new Error("Please provide all fields");

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, email: user.email, token: generateToken(user._id) });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) throw new Error("Invalid credentials");

  res.json({ _id: user._id, email: user.email, token: generateToken(user._id) });
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new Error("User not found");

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
  const message = `Reset your password using: ${resetURL}`;
  //await sendEmail(user.email, "Reset Password", htmlTemplate);

  // await sendEmail({ email: user.email, subject: "Password Reset", message });

  res.status(200).json({ success: true, message: "Token sent to email" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token expired or invalid");

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});



 
// ✅ Export All Functions
module.exports = {
  registerUser,
  loginUser,
  forgotPasswordToken,
  resetPassword
};