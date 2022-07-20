const express = require('express');
const router = express.Router();
const {
	getCharacter,
	getCharacters,
	createCharacter,
	updateCharacter,
	deleteCharacter,
} = require('../controllers/characterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCharacters).post(protect, createCharacter);
router
	.route('/:id')
	.get(protect, getCharacter)
	.put(protect, updateCharacter)
	.delete(protect, deleteCharacter);

module.exports = router;
