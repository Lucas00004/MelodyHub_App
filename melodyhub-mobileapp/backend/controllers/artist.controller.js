const pool = require('../db');

const artist = {
    
  getAllArtist: async (req, res) => {
    try {
      const rows = await pool.query('SELECT * FROM artist');
      res.json(rows);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách artist:', err);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách artist' });
    }
  },


};

module.exports = artist;