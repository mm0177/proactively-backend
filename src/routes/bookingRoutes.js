const express = require('express');
const { bookSession } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookSession);

module.exports = router;
