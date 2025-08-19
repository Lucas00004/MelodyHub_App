const pool = require('../db');

const createBooking = async (req, res) => {
  let conn;
  try {
    const { id_event, quantity = 1, payment_method } = req.body;
    const id_user = req.user?.userId;

    if (!id_user) return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    if (!id_event || !Number.isFinite(Number(id_event))) {
      return res.status(400).json({ success: false, message: 'id_event không hợp lệ' });
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'quantity không hợp lệ' });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    console.log('📩 Body:', req.body, '🔑 id_user:', id_user);

    // 1) Lấy seat_left (hỗ trợ mọi kiểu trả về)
    const sel = await conn.query(
      'SELECT seat_left FROM event WHERE id_event = ? FOR UPDATE',
      [id_event]
    );

    // chuẩn hoá row đầu tiên
    let eventRow = null;
    if (Array.isArray(sel)) {
      // mariadb: rows[]  | mysql2: [rows[], fields]
      if (sel.length > 0 && Array.isArray(sel[0])) {
        // mysql2: [rows[], fields]
        eventRow = sel[0][0] ?? null;
      } else {
        // mariadb: rows[]
        eventRow = sel[0] ?? null;
      }
    } else if (sel && typeof sel === 'object') {
      // driver trả trực tiếp object đơn
      eventRow = sel;
    }

    console.log('📦 eventRow:', eventRow);

    if (!eventRow) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Sự kiện không tồn tại' });
    }

    const seatLeft = Number(eventRow.seat_left ?? 0);
    if (qty > seatLeft) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${seatLeft} ghế, không đủ để đặt ${qty} vé`
      });
    }

    // 2) Trừ ghế với điều kiện (tránh âm ghế)
    const upd = await conn.query(
      'UPDATE event SET seat_left = seat_left - ? WHERE id_event = ? AND seat_left >= ?',
      [qty, id_event, qty]
    );

    // lấy affectedRows cho cả 2 kiểu trả về
    const affectedRows = Array.isArray(upd)
      ? (upd[0]?.affectedRows ?? 0)
      : (upd?.affectedRows ?? 0);

    if (affectedRows === 0) {
      await conn.rollback();
      return res.status(409).json({ success: false, message: 'Hết ghế, vui lòng thử lại' });
    }

    // 3) Tạo booking
    const ins = await conn.query(
      `INSERT INTO booking (id_event, id_user, quantity, payment_method, booking_date)
       VALUES (?, ?, ?, ?, NOW())`,
      [id_event, id_user, qty, payment_method]
    );

    // lấy insertId cho mọi kiểu trả về
    const bookingId = Array.isArray(ins)
      ? (ins[0]?.insertId ?? null)
      : (ins?.insertId ?? null);

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: 'Đặt vé thành công',
      bookingId,
      seatLeftBefore: seatLeft,
      seatLeftAfter: seatLeft - qty
    });
  } catch (err) {
    if (conn) { try { await conn.rollback(); } catch (_) {} }
    console.error('❌ Lỗi đặt vé:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  } finally {
    if (conn) conn.release();
  }
};

// controllers/bookingController.js
const getRecord = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy từ middleware JWT

    const rows = await pool.query(
      `SELECT 
        b.id_booking,
        e.name AS event_name,
        b.quantity,
        e.ticket_price AS amount,
        b.booking_date,
        e.image
      FROM booking b
      JOIN event e ON b.id_event = e.id_event
      WHERE b.id_user = ?
      ORDER BY b.booking_date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error('getBookingHistory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createBooking, getRecord };
