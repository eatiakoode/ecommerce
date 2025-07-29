// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure folder exists
// // const uploadDir = "Backend/public/uploads";
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }
// const uploadDir = path.join(__dirname, "../public/uploads");
// console.log("Upload Dir:", uploadDir);


// const storage = multer.diskStorage({
  
//    filename: function (req, file, cb) {
//     // Use the type from request, default to 'upload'
//     const type = req.body.type || 'upload'; 
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${type}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");

    // Ensure folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created upload folder at:", uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const type = req.body.type || "upload";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${type}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
