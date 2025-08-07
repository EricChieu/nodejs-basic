const mongoose = require("mongoose");

// 1. Định nghĩa Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Bắt buộc phải có
  },
  email: {
    type: String,
    required: true,
    unique: true, // Không được trùng
  },
  // Thêm trường password vào đây
  password: {
    type: String,
    required: true,
  },
});

// 2. Tạo Model từ Schema
const User = mongoose.model("User", userSchema);

module.exports = User;
