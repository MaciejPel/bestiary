const asyncHandler = require('express-async-handler');
const { uploadImage } = require('../config/imgurAPI');
const Character = require('../models/characterModel');
const Media = require('../models/mediaModel');

const getCharacter = asyncHandler(async (req, res) => {
	if (!req.params.id) {
		res.status(400);
		throw new Error('Please add a name field');
	}

	const character = await Character.findById(req.params.id, {
		name: 1,
		user: 1,
		images: 1,
	}).populate('images user', 'hash fileName fileType likes user nick');
	res.status(200).json(character);
});

const getCharacters = asyncHandler(async (req, res) => {
	const characters = await Character.find({}, { name: 1, images: 1, user: 1, totalLikes: 1 }).sort({
		totalLikes: -1,
		name: 1,
	});

	const result = [];
	for (const i in characters) {
		let populatedImages = await characters[i].populate('images user', {
			hash: 1,
			fileName: 1,
			fileType: 1,
			likes: 1,
			nick: 1,
		});

		result.push(populatedImages);
	}
	res.status(200).json(result);
});

const createCharacter = asyncHandler(async (req, res) => {
	if (!req.body.name) {
		res.status(400);
		throw new Error('Please provide a name and an image');
	}

	if (req.files) {
		const imageID = await uploadImage(req.files.file.name, req.files.file.data);

		const media = await Media.create({
			hash: imageID,
			fileName: req.files.file.name,
			fileType: req.files.file.mimetype.replace('image/', ''),
			user: req.user.id,
		});

		if (media) {
			const character = await Character.create({
				name: req.body.name,
				user: req.user.id,
				images: [media.id],
			});
			res.status(200).json(character);
		}
	} else {
		const character = await Character.create({
			name: req.body.name,
			user: req.user.id,
			images: [],
		});
		res.status(200).json(character);
	}
});

const updateCharacter = asyncHandler(async (req, res) => {
	const character = await Character.findById(req.params.id);

	if (!character) {
		res.status(400);
		throw new Error('Character not found');
	}

	const updatedCharacter = await Character.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	res.status(200).json(updatedCharacter);
});

const deleteCharacter = asyncHandler(async (req, res) => {
	const character = await Character.findById(req.params.id);

	if (!character) {
		res.status(400);
		throw new Error('Character not found');
	}

	await character.remove();

	res.status(200).json({ id: req.params.id });
});

module.exports = {
	getCharacters,
	getCharacter,
	createCharacter,
	updateCharacter,
	deleteCharacter,
};
