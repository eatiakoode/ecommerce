const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;

// Import Routes
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/category");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const customerRouter = require("./routes/customerRoute");
const uploadRouter = require("./routes/uploadRoute");
const categoryFrontendRouter = require("./routes/categoryFrontendRouter");
const staffRouter = require("./routes/staffRoute");
const productRoutes = require("./routes/productRoute");
const dealRoute = require("./routes/dealRoute");
const orderRoute = require("./routes/order");
const userAuthRoutes = require("./routes/userAuthRoutes");
const sizeRoutes = require("./routes/sizeRoutes");
const instapostRoutes = require('./routes/instapostRoutes');// ✅ Add Testimonial Route
const testimonialRoutes = require("./routes/testimonialRoutes");

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// DB Connection
dbConnect();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static Files
app.use('/public', express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/instapost', instapostRoutes);
app.use("/api/size", sizeRoutes);
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/customer", customerRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/frontend/category", categoryFrontendRouter);
app.use("/api/staff", staffRouter);
app.use("/api/deal", dealRoute);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoute);
app.use("/api/user-auth", userAuthRoutes);

// ✅ Register Testimonial Route
app.use("/api/testimonials", testimonialRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
