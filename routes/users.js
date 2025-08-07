const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Nạp User model
const authMiddleware = require("../middleware/authMiddleware"); // Nạp middleware

// GET /api/users: Lấy tất cả người dùng (Đã được bảo vệ)
// Thêm `authMiddleware` vào giữa đường dẫn và route handler
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Giờ chúng ta có thể truy cập req.user từ middleware
    console.log("ID người dùng đang truy cập:", req.user.id);

    const users = await User.find().select("-password"); // .select('-password') để không trả về password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /users: Tạo người dùng mới
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Tạo user mới từ req.body
    res.status(201).json(newUser); // Phản hồi lại user vừa được tạo
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /users/:id (Bạn có thể tự phát triển thêm các route khác như thế này)

// PUT /users/:id: Cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Tìm và cập nhật user trong database
    // { new: true } để kết quả trả về là user sau khi đã được cập nhật
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      // Nếu không tìm thấy user với ID tương ứng
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json(updatedUser); // Phản hồi lại thông tin user đã được cập nhật
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /users/:id: Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
