const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
     require('dotenv').config(); // at the top of your file
   const conn = mongoose.connect(process.env.MONGODB_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("DAtabase error");
  }
};
module.exports = dbConnect;
