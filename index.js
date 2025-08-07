require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database"); // Nạp hàm kết nối
const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth"); // Nạp auth route
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Đây là trang chủ!");
});

app.use("/api/users", userRoutes); // Đổi thành /api/users cho nhất quán

app.use("/api/auth", authRoutes); // Sử dụng auth route

// Thay vì const port = 3000;
const PORT = process.env.PORT || 3000; // Dùng cổng của server, nếu không có thì dùng 3000

app.listen(PORT, () => {
  console.log(`Ứng dụng đang chạy tại cổng ${PORT}`);
});
