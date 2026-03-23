const express = require('express');
const router = express.Router();
const { generateResume, getHistory, downloadPDF, downloadResumeTex, previewResume} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

router.post('/preview', authMiddleware, previewResume)
router.post('/generate', authMiddleware, generateResume);
router.get('/history', authMiddleware, getHistory);
router.get('/:id/download-tex', authMiddleware, downloadResumeTex);
router.get('/:id/download-pdf', authMiddleware, downloadPDF);

module.exports = router;
