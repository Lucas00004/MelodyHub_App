const pool = require('../db'); // import kết nối DB

// Lấy tất cả event
const getAllEvents = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT e.id_event, e.name, e.ticket_price, e.start_time, e.end_time,
            e.image, e.description, e.seat_left,
            v.name AS venue_name,
            c.name AS category_name
      FROM event e
      JOIN venue v ON e.id_venue = v.id_venue
      JOIN category c ON e.id_category = c.id_category
    `);

    res.json(rows); // rows đã là array object
  } catch (err) {
    console.error("Lỗi getAllEvents:", err);
    res.status(500).json({ message: "Lỗi server" });
  } finally {
    if (conn) conn.release();
  }
};

// Lấy event theo ID
const getEventById = async (req, res) => {
        try {
          const { id } = req.params;

          const sql = `
            SELECT 
              e.id_event,
              e.name AS event_name,
              e.id_category,
              e.start_time,
              e.end_time,
              e.ticket_price,
              e.description,
              e.image,
              e.seat_left,
              v.name AS venue_name
            FROM event e
            LEFT JOIN venue v ON e.id_venue = v.id_venue
            WHERE e.id_event = ?
            LIMIT 1
          `;

          const rows = await pool.query(sql, [id]);

          if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy event" });
          }

          res.json(rows[0]);
        } catch (err) {
          console.error("Lỗi getEventById:", err);
          res.status(500).json({ message: "Lỗi server" });
        }
      };

// Thêm event mới
const createEvent = async (req, res) => {
  const { name, ticket_price, start_time, image } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      'INSERT INTO event (name, ticket_price, start_time, image) VALUES (?, ?, ?, ?)',
      [name, ticket_price, start_time, image]
    );
    res.status(201).json({ id_event: result.insertId });
  } catch (err) {
    console.error('Lỗi khi thêm event:', err);
    res.status(500).json({ error: 'Insert failed' });
  } finally {
    if (conn) conn.release();
  }
};

// Cập nhật event
const updateEvent = async (req, res) => {
  const { id_event } = req.params;
  const { name, ticket_price, start_time, image } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      'UPDATE event SET name=?, ticket_price=?, start_time=?, image=? WHERE id_event=?',
      [name, ticket_price, start_time, image, id_event]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện để cập nhật' });
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Lỗi khi cập nhật event:', err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    if (conn) conn.release();
  }
};

// Xoá event
const deleteEvent = async (req, res) => {
  const { id_event } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      'DELETE FROM event WHERE id_event=?',
      [id_event]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện để xoá' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Lỗi khi xoá event:', err);
    res.status(500).json({ error: 'Delete failed' });
  } finally {
    if (conn) conn.release();
  }
};




module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
