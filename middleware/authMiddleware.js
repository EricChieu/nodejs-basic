const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Lấy token từ header của request
  const token = req.header("x-auth-token");

  // 2. Nếu không có token, trả về lỗi
  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  // 3. Nếu có token, xác thực nó
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Gắn thông tin user đã giải mã vào request
    next(); // Cho phép đi tiếp đến route handler
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
