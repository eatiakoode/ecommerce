const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
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
const staffRouter = require("./routes/staffRoute");
// const productRoutes = require("./routes/productRoute");
const sizeRoute = require("./routes/sizeRoute");
//add new api
const dealRoute = require("./routes/dealRoute");
const orderRoute = require("./routes/order");
const faqRoutes = require("./routes/faqRoutes");

const categoryFrontendRouter = require("./routes/Frontend/categoryRoute");
const instagramFrntRoutes = require("./routes/Frontend/instaFrntRoute");
const productFrontendRouter = require("./routes/Frontend/productFrntRoute");
const sliderRoute = require("./routes/sliderRoute");
const sliderFrntRoute = require("./routes/Frontend/sliderFrntRoute");
const instapostRoutes = require('./routes/instaPostRoute');
const testimonialRoutes = require("./routes/testimonialRoute");
const testimonialFrntRoutes = require("./routes/Frontend/testimonialFrntRoute");


// eati test
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4001',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-HTTP-Method-Override'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

dbConnect();
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use("/api/staff", staffRouter);
// const path = require("path");
app.use("/api/deal",dealRoute);
// app.use("/api/product", productRoutes);
app.use('/api/order', orderRoute);
app.use("/api/faq", faqRoutes);

app.use("/api/frontend/category", categoryFrontendRouter);
app.use("/api/frontend/instagram", instagramFrntRoutes);
app.use("/api/frontend/product", productFrontendRouter);
app.use("/api/slider", sliderRoute);
app.use("/api/frontend/slider", sliderFrntRoute);
app.use("/api/instapost", instapostRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/frontend/testimonials", testimonialFrntRoutes);
app.use("/api/size", sizeRoute);


// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));
// app.use('/images', express.static('path_to_images_directory'));
// app.use('/public', express.static(path.join(__dirname, 'public')));
const fs = require('fs');
const path = require("path");
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// const testImagePath = path.join(__dirname, 'public/images/upload-1752933459572-592741853.jpg');
// console.log('Checking for image at:', testImagePath);
// console.log('Does image exist?', fs.existsSync(testImagePath));
console.log("testimage");
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});

