const pool = require('../db');

const venue = {
    getAllVenue: async (req, res) => {
        try {
        const rows = await pool.query('SELECT * FROM venue');
        res.json(rows);
        } catch (err) {
        console.error('Lỗi khi lấy danh sách venue:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách venue' });
        }
    },



};

module.exports = venue;