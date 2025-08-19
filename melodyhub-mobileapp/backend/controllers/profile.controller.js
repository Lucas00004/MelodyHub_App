const pool = require('../db');
const bcrypt = require('bcryptjs');


const getProfile = async (req, res) => {
  try {
    const id_user = req.user.userId; // Lấy từ token qua authMiddleware

    const rows = await pool.query(
      `SELECT id_user, username, email, role, phone 
       FROM user
       WHERE id_user = ?`,
      [id_user]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// PUT /api/profile
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // từ middleware
  console.log("UserId từ token:", userId);

  let conn;
  try {
    conn = await pool.getConnection();

    const [rows] = await conn.execute(
      'SELECT * FROM user WHERE id_user = ?',
      [userId]
    );

    const user = Array.isArray(rows) ? rows[0] : rows;
    console.log("Kết quả truy vấn user:", user);

    if (!user) {
      console.warn("Không tìm thấy user trong DB");
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!oldPassword || !newPassword) {
      console.warn("Thiếu mật khẩu cũ hoặc mới");
      return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log(`So sánh mật khẩu: nhập=${oldPassword}, DB=${user.password}, Kết quả=${isMatch}`);

    if (!isMatch) {
      console.warn("Mật khẩu cũ không đúng");
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await conn.execute('UPDATE user SET password = ? WHERE id_user = ?', [hashedPassword, userId]);

    res.json({ message: "Đổi mật khẩu thành công" });

  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  } finally {
    if (conn) conn.release();
  }
};










module.exports = { getProfile, changePassword };
