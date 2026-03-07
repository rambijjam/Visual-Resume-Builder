const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getRepo } = require('../controllers/githubController');

router.get('/repo', authMiddleware, getRepo);

module.exports = router;