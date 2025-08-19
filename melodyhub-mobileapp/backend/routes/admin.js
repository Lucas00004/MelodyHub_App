const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const admin = require('../controllers/admin.controller');

//Event
//Sài ké getAllEvent trong event.controller
router.post('/event', admin.createEvent );
router.delete('/event/:id_event', admin.deleteEvent );

//User
router.post('/user', admin.createUser);
router.get('/user', admin.getAllUser);
router.delete('/user/:id_user', admin.deleteUser);
router.put('/user/:id_user', admin.updateUser);

//Booking
router.get('/booking', admin.getAllBooking) ;
router.delete('/booking/:id_booking', admin.deleteBooking) ;

//Venue
router.get('/venue', admin.getAllVenue );
router.post('/venue', admin.createVenue );
router.put('/venue/:id_venue', admin.updateVenue );
router.delete('/venue/:id_venue', admin.deleteVenue);


//Category
router.get('/category', admin.getAllCategory );
router.post('/category', admin.createCategory );
router.put('/category/:id', admin.updateCategory );
router.delete('/category/:id', admin.deleteCategory );


//Artist
router.get('/artist', admin.getAllArtist );
router.post('/artist', admin.createArtist );
router.put('/artist/:id', admin.updateArtist );
router.delete('/artist/:id', admin.deleteArtist );


//Review
router.get('/review', admin.getAllReview);
router.delete('/review', admin.deleteReview);



module.exports = router;
