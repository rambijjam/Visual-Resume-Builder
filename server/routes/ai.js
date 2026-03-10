const express = require('express');
const router = express.Router();
const { generatePoints, enhance } = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.post('/generate-points', authMiddleware, generatePoints);
router.post('/enhance', authMiddleware, enhance);

module.exports = router;
