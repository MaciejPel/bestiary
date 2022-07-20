const express = require('express');
const router = express.Router();
const { getMedia, deleteMedia, likeMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMedia);
router.route('/:id').put(protect, likeMedia).delete(protect, deleteMedia);

module.exports = router;
