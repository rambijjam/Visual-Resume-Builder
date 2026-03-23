const express = require('express');
const router = express.Router();
const { enhance, generateProjectBullets } = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.post('/enhance', authMiddleware, enhance);
router.post('/generate-project-bullets', authMiddleware, generateProjectBullets)

module.exports = router;
