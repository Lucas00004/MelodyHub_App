const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // file kết nối MariaDB (sử dụng pool thay vì db trực tiếp nếu db.js trả về pool)

const register = async (req, res) => {
  const { username, password, email, phone } = req.body;

  // Validation cơ bản
  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }
  if (!/^\d{8,15}$/.test(String(phone))) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // ❗ mariadb trả về mảng rows trực tiếp
    const checkRows = await conn.query(
      'SELECT id_user FROM `user` WHERE username = ? OR email = ?',
      [username, email]
    );

    if (Array.isArray(checkRows) && checkRows.length > 0) {
      return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Nếu cột created_at có DEFAULT CURRENT_TIMESTAMP thì có thể bỏ trường này đi
    const result = await conn.query(
      'INSERT INTO `user` (username, password, email, phone, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [username, hash, email, phone, 'client']
    );

    return res.status(201).json({
      message: 'Đăng ký thành công',
      id_user: result.insertId,
    });

  } catch (err) {
    console.error('Lỗi trong register:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau' });
  } finally {
    if (conn) conn.release();
  }
};



const login = async (req, res) => {
  const { username, password } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    const [rows] = await conn.execute('SELECT * FROM user WHERE username = ?', [
      username,
    ]);

    const user = Array.isArray(rows) ? rows[0] : rows;

    if (user === undefined || user === null) {
      console.log('User null sau truy vấn');
      return res.status(400).json({ message: 'Sai username hoặc mật khẩu' });
    }
    if (!user.password) {
      console.log('User không có trường password:', user);
      return res.status(500).json({ message: 'User không có trường password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Mật khẩu không đúng');
      return res.status(400).json({ message: 'Sai username hoặc mật khẩu' });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user || user.id,
        username: user.username,
        role: user.role,
      },
      'your-secret-key', // Thay đổi secret key này trong production
      { expiresIn: '24h' },
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id_user || user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
    console.log("Đăng nhập thành công!");
  } catch (err) {
    console.error('Lỗi trong login:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  register,
  login
};
