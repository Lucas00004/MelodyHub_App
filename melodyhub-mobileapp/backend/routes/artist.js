const express = require('express');
const router = express.Router();
const artist = require('../controllers/artist.controller')

router.get('/', artist.getAllArtist);





module.exports = router;