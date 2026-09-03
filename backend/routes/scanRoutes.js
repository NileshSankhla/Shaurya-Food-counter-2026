const express = require('express');
const router = express.Router();
const { verifyScan, getHistory, getStats } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', protect, verifyScan);
router.get('/history', protect, getHistory);
router.get('/stats', protect, getStats);

module.exports = router;
