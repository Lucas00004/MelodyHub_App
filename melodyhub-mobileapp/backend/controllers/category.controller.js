const pool = require('../db');

const category = {
    getAllCategory: async (req, res) => {
        try {
        const rows = await pool.query('SELECT * FROM category');
        res.json(rows);
        } catch (err) {
        console.error('Lỗi khi lấy danh sách category:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách category' });
        }
    },

};

module.exports = category;