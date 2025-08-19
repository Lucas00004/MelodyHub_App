const pool = require('../db');
const bcrypt = require('bcrypt');


const admin = {
  // Event 
  createEvent: async (req, res) => {
    let conn;
    try {
      const {
        name,
        id_venue,
        id_category,
        start_time,
        end_time,
        ticket_price,
        description,
        image, // đây sẽ là URL
        seat_left
      } = req.body;

      if (!name || !id_venue || !id_category || !start_time || !end_time || !ticket_price || !seat_left) {
        return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
      }

      conn = await pool.getConnection();

      const sql = `
        INSERT INTO event 
        (name, id_venue, id_category, start_time, end_time, ticket_price, description, image, seat_left)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await conn.query(sql, [
        name,
        id_venue,
        id_category,
        start_time,
        end_time,
        ticket_price,
        description || null,
        image || null, // URL ảnh
        seat_left
      ]);

      res.status(201).json({
        message: 'Tạo event thành công',
        id_event: result.insertId,
        image
      });
    } catch (error) {
      console.error('Lỗi tạo event:', error);
      res.status(500).json({ message: 'Lỗi server khi tạo event' });
    } finally {
      if (conn) conn.release();
    }
  },
  deleteEvent: async (req, res) => {
    let conn;
    try {
      const { id_event } = req.params;
      if (!id_event) {
        return res.status(400).json({ message: 'Thiếu id_event' });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        'DELETE FROM event WHERE id_event = ?',
        [id_event]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy event' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Lỗi xóa event: ', err);
      res.status(500).json({ message: 'Lỗi server khi xóa event' });
    } finally {
      if (conn) conn.release();
    }
  },


  //User
  getAllUser: async (req, res) => {
    console.log("📩 API /api/admin/user được gọi");

    try {
      // Test query rất đơn giản trước
      const conn = await pool.getConnection();
      console.log("✅ Kết nối MariaDB thành công");

      const rows = await conn.query('SELECT * FROM `user`');
      console.log(`📊 Lấy được ${rows.length} user`);
      
      conn.release();

      res.json(rows);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách user:", error);
      res.status(500).json({
        message: 'Lỗi server khi lấy danh sách user',
        error: error.message
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password, role, phone } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      // Check email tồn tại chưa
      const checkUser = await pool.query(
        'SELECT * FROM user WHERE email = ?',
        [email]
      );

      if (checkUser.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      // Mã hoá password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm user mới
      const result = await pool.query(
        'INSERT INTO user (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role || 'client', phone || null]
      );

      return res.status(201).json({
        message: 'Tạo user thành công',
        id_user: result.insertId,
      });

    } catch (error) {
      console.error('Lỗi tạo user:', error);
      return res.status(500).json({ message: 'Lỗi server khi tạo user', error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id_user } = req.params;
      let { username, email, password, role, phone } = req.body;

      // Nếu có password mới → hash lại
      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } else {
        // Nếu không gửi password mới → giữ nguyên password cũ
        const rows = await pool.query('SELECT password FROM user WHERE id_user = ?', [id_user]);
        if (rows.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy user' });
        }
        password = rows[0].password;
      }

      const result = await pool.query(
        'UPDATE user SET username = ?, email = ?, password = ?, role = ?, phone = ? WHERE id_user = ?',
        [username, email, password, role, phone, id_user]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user để cập nhật' });
      }

      console.log(`Cập nhật thành công user có id: ${id_user}`);
      res.json({ message: 'Cập nhật user thành công' });

    } catch (error) {
      console.error('Lỗi khi cập nhật user:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật user', error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id_user } = req.params;
      if (!id_user) return res.status(400).json({ message: 'Thiếu id_user' });

      const result = await pool.query('DELETE FROM user WHERE id_user = ?', [id_user]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      res.json({ message: 'Xóa user thành công' });
    } catch (error) {
      console.error('Lỗi xóa user:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa user' });
    }
  },




  //VENUE
  getAllVenue: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM venue ORDER BY name");
      return res.json(rows);
    } catch (error) {
      console.error("Lỗi lấy venue:", error);
      return res.status(500).json({ message: "Lỗi server khi lấy venue" });
    } finally {
      if (conn) conn.release();
    }
  },

  createVenue: async (req, res) => {
    try {
      const { name, capacity, image } = req.body;

      if (!name || !capacity) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đủ name và capacity" });
      }

      await pool.query(
        "INSERT INTO venue (name, capacity, image) VALUES (?, ?, ?)",
        [name, capacity, image || null]
      );

      res.status(201).json({ message: "Tạo venue thành công" });
    } catch (error) {
      console.error("Lỗi tạo venue:", error);
      res.status(500).json({ message: "Lỗi server khi tạo venue" });
    }
  },

  updateVenue: async (req, res) => {
    try {
      const { id_venue } = req.params;
      const { name, capacity, image } = req.body;

      if (!id_venue || !name || !capacity) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
      }

      const result = await pool.query(
        "UPDATE venue SET name = ?, capacity = ?, image = ? WHERE id_venue = ?",
        [name, capacity, image || null, id_venue]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy venue" });
      }

      res.json({ message: "Cập nhật venue thành công" });
    } catch (error) {
      console.error("Lỗi cập nhật venue:", error);
      res.status(500).json({ message: "Lỗi server khi cập nhật venue" });
    }
  },


  deleteVenue: async (req, res) => {
    try {
      const { id_venue } = req.params;
      if (!id_venue)
        return res.status(400).json({ message: "Thiếu id_venue" });

      const result = await pool.query(
        "DELETE FROM venue WHERE id_venue = ?",
        [id_venue]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Không tìm thấy venue" });

      res.json({ message: "Xóa venue thành công" });
    } catch (error) {
      console.error("Lỗi xóa venue:", error);
      res.status(500).json({ message: "Lỗi server khi xóa venue" });
    }
  },




  //Category
  getAllCategory : async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        "SELECT * FROM category ORDER BY id_category DESC"
      );
      return res.json(rows);
    } catch (error) {
      console.error("Lỗi lấy category:", error);
      return res.status(500).json({ message: "Lỗi server khi lấy category" });
    } finally {
      if (conn) conn.release();
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, image } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Thiếu tên thể loại" });
      }

      await pool.query(
        "INSERT INTO category (name, image) VALUES (?, ?)",
        [name, image || null]
      );

      res.json({ message: "Thêm thể loại thành công" });
    } catch (err) {
      console.error("Lỗi tạo category:", err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Thiếu tên thể loại" });
      }

      const result = await pool.query(
        "UPDATE category SET name = ?, image = ? WHERE id_category = ?",
        [name, image || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy thể loại" });
      }

      res.json({ message: "Cập nhật thể loại thành công" });
    } catch (err) {
      console.error("Lỗi update category:", err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM category WHERE id_category = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy thể loại" });
      }

      res.json({ message: "Xóa thể loại thành công" });
    } catch (err) {
      console.error("Lỗi delete category:", err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },





  //Booking
  getAllBooking: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM booking ORDER BY booking_date DESC');
      return res.json(rows);
    } catch (error) {
      console.error('Lỗi lấy booking:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy booking' });
    } finally {
      if (conn) conn.release();
    }
  },
  deleteBooking: async (req, res) => {
    let conn;
    try {
      const { id_booking } = req.params;
      if (!id_booking) {
        return res.status(400).json({ message: 'Thiếu id_booking' });
      }

      conn = await pool.getConnection();
      const result = await conn.query(
        'DELETE FROM booking WHERE id_booking = ?',
        [id_booking]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy booking' });
      }
      console.log(`Xóa thành công booking có id: ${id_booking}`)
      res.json({ success: true });
    } catch (err) {
      console.error('Lỗi xóa booking: ', err);
      res.status(500).json({ message: 'Lỗi server khi xóa booking' });
    } finally {
      if (conn) conn.release();
    }
  },



  //Artist
  getAllArtist: async (req, res) => {
    try {
      const rows = await pool.query("SELECT * FROM artist");
      // Không cần convert base64 nữa, vì image giờ là link string
      res.json(rows);
    } catch (error) {
      console.error("Lỗi lấy danh sách artist:", error);
      res.status(500).json({ message: "Lỗi server khi lấy danh sách artist" });
    }
  },

  createArtist: async (req, res) => {
    try {
      const { name, gender, bio, image } = req.body; // image là URL
      if (!name || !gender) {
        return res.status(400).json({ message: "Thiếu tên hoặc giới tính" });
      }

      await pool.query(
        "INSERT INTO artist (name, gender, bio, image) VALUES (?, ?, ?, ?)",
        [name, gender, bio || "", image || null]
      );

      res.json({ message: "Tạo artist thành công" });
    } catch (error) {
      console.error("Lỗi tạo artist:", error);
      res.status(500).json({ message: "Lỗi server khi tạo artist" });
    }
  },

  updateArtist: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, gender, bio, image } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Thiếu id artist" });
      }

      const result = await pool.query(
        "UPDATE artist SET name=?, gender=?, bio=?, image=? WHERE id_artist=?",
        [name || "", gender || "", bio || "", image || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy artist để cập nhật" });
      }

      res.json({ message: "Cập nhật artist thành công" });
    } catch (error) {
      console.error("Lỗi cập nhật artist:", error);
      res.status(500).json({ message: "Lỗi server khi cập nhật artist" });
    }
  },

  deleteArtist: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu id artist" });
      }

      await pool.query("DELETE FROM artist WHERE id_artist = ?", [id]);

      res.json({ message: "Xóa artist thành công" });
    } catch (error) {
      console.error("Lỗi xóa artist:", error);
      res.status(500).json({ message: "Lỗi server khi xóa artist" });
    }
  },



  //Review
  getAllReview: async (req, res) => {
    try {
      const rows = await pool.query(`
        SELECT r.id_review, r.id_user, r.id_event, r.rating, r.comment, r.review_date,
               e.name AS event_name,
               u.username AS user_name   -- đổi sang username
        FROM review r
        JOIN event e ON r.id_event = e.id_event
        JOIN user u ON r.id_user = u.id_user
        ORDER BY r.review_date DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error("Lỗi getAllReview:", err);
      res.status(500).json({ message: "Lỗi server khi lấy review" });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.body; // nhận id_review từ body
      if (!id) {
        return res.status(400).json({ message: "Thiếu id_review" });
      }

      const result = await pool.query(
        "DELETE FROM review WHERE id_review = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy review" });
      }

      res.json({ message: "Xóa review thành công" });
    } catch (err) {
      console.error("Lỗi deleteReview:", err);
      res.status(500).json({ message: "Lỗi server khi xóa review" });
    }
  },

};

module.exports = admin;
