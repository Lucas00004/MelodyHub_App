const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth'); 

// Lấy user
router.get('/', authMiddleware, profile.getProfile);

//Sửa user
router.put('/', authMiddleware, profile.changePassword);


module.exports = router;
