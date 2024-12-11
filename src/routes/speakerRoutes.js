const express = require('express');
const { addSpeakerProfile } = require('../controllers/speakerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/profile', authMiddleware, roleMiddleware(['speaker']), addSpeakerProfile);

module.exports = router;
