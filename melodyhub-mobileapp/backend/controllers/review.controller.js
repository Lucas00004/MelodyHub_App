const pool = require('../db');

const getReview = async (req, res) => {
  const { id_event } = req.params;

  try {
    const conn = await pool.getConnection();

    const query = `
      SELECT 
        r.id_user,
        r.id_event,
        r.rating,
        r.comment,
        r.review_date,
        u.username
      FROM review r
      JOIN user u ON r.id_user = u.id_user
      WHERE r.id_event = ?
      ORDER BY r.review_date DESC
    `;

    const reviews = await conn.query(query, [id_event]);

    conn.release();

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Lỗi khi lấy review:', error);
    res.status(500).json({ message: 'Không thể lấy review cho sự kiện này.' });
  }
};


const createReview = async (req, res) => {
  const { id_event, rating, comment } = req.body;
  const id_user = req.user.id_user; // lấy từ token decode

  if (!id_user || !id_event || !rating || !comment) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
  }

  try {
    const conn = await pool.getConnection();
    const query = `
      INSERT INTO review (id_user, id_event, rating, comment, review_date)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const result = await conn.query(query, [id_user, id_event, rating, comment]);
    conn.release();

    res.status(201).json({
      success: true,
      message: 'Tạo review thành công.',
      review_id: result.insertId
    });
  } catch (error) {
    console.error('Lỗi khi tạo review:', error);
    res.status(500).json({ message: 'Không thể tạo review.' });
  }
};


const deleteReview = async (req, res) => {
  const { id_review } = req.body;
  const id_user = req.user?.id_user; // Lấy từ middleware auth

  if (!id_review || !id_user) {
    return res.status(400).json({ message: 'Thiếu thông tin id_review hoặc người dùng.' });
  }

  try {
    const conn = await pool.getConnection();

    // Kiểm tra quyền sở hữu review
    const checkQuery = `
      SELECT id_user FROM review WHERE id_review = ?
    `;
    const [review] = await conn.query(checkQuery, [id_review]);

    if (!review || review.id_user !== id_user) {
      conn.release();
      return res.status(403).json({ message: 'Bạn không có quyền xóa review này.' });
    }

    // Xóa review
    const deleteQuery = `
      DELETE FROM review WHERE id_review = ?
    `;
    await conn.query(deleteQuery, [id_review]);

    conn.release();

    res.status(200).json({ message: 'Xóa review thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa review:', error);
    res.status(500).json({ message: 'Không thể xóa review.' });
  }
};





module.exports = {
  getReview, createReview, deleteReview
};
