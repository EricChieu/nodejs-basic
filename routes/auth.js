const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Nạp thư viện jsonwebtoken
const { check, validationResult } = require("express-validator"); // Nạp thư viện
const User = require("../models/userModel");

// POST /api/auth/register
router.post(
  "/register",
  // Đây là mảng chứa các middleware kiểm tra dữ liệu
  [
    check("name", "Tên không được để trống").not().isEmpty(),
    check("email", "Vui lòng nhập một email hợp lệ").isEmail(),
    check("password", "Mật khẩu phải có ít nhất 6 ký tự").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // 1. Kiểm tra kết quả validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();
      res.status(201).json({ message: "Đăng ký người dùng thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
    }
  }
);

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    // 1. Lấy email và password từ client
    const { email, password } = req.body;

    // 2. Tìm người dùng trong database theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // 3. So sánh mật khẩu client gửi lên với mật khẩu đã hash trong database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // 4. Nếu mật khẩu khớp, tạo JWT
    const payload = {
      user: {
        id: user.id, // Chỉ cần lưu id của user vào token
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Khóa bí mật, trong thực tế sẽ lưu ở file .env
      { expiresIn: "1h" }, // Token hết hạn sau 1 giờ
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Gửi token về cho client
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
