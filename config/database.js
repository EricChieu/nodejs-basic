const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Kết nối MongoDB thành công! 🎉");
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error.message);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
};

module.exports = connectDB;
