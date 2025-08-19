const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Không có token' });
  }

  const token = authHeader.split(' ')[1]; // Bỏ chữ Bearer
  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
