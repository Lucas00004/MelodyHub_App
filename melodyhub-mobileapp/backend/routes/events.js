const express = require('express');
const router = express.Router();
const events = require('../controllers/events.controller')

// GET all events
router.get('/', events.getAllEvents);

// GET one event by ID
router.get('/:id', events.getEventById);

// POST new event
router.post('/', events.createEvent);

// PUT update event
router.put('/:id', events.updateEvent);

// DELETE event
router.delete('/:id', events.deleteEvent);


module.exports = router;
