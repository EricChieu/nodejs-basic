require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database"); // Nạp hàm kết nối
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});
