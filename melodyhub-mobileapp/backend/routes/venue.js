const express = require('express');
const router = express.Router();
const venue = require('../controllers/venue.controller')

router.get('/', venue.getAllVenue);





module.exports = router;