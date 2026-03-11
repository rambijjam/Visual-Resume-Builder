const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');
const { checkATS } = require('../controllers/atsController');


router.post('/check', authMiddleware, upload.single('resume'), checkATS);

module.exports = router;