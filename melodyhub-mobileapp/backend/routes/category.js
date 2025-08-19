const express = require('express');
const router = express.Router();
const category = require('../controllers/category.controller')

router.get('/', category.getAllCategory);





module.exports = router;