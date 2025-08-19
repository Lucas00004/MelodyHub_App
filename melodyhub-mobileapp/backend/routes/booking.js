const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth'); 

// Tạo booking mới
router.post('/', authMiddleware, bookingController.createBooking);

//Lấy record của user theo id
router.get('/', authMiddleware, bookingController.getRecord);

module.exports = router;
