const asyncHandler = require('express-async-handler');
const Media = require('../models/mediaModel');
const Character = require('../models/characterModel');
const { deleteImage } = require('../config/imgurAPI');
var mongoose = require('mongoose');

const getMedia = asyncHandler(async (req, res) => {
	const media = await Media.find({}, { hash: 1, fileName: 1, fileType: 1, likes: 1, user: 1 });

	const result = [];
	for (const i in media) {
		let populateImages = await media[i].populate('user', {
			nick: 1,
		});
		result.push(populateImages);
	}

	res.status(200).json(result);
});

const likeMedia = asyncHandler(async (req, res) => {
	const media = await Media.findOne({ _id: req.params.id });
	const isInArrayOfLikes = media.likes.includes(req.user.id);
	const allReferences = await Character.find({ images: req.params.id });

	for (const i in allReferences) {
		await Character.findByIdAndUpdate(
			allReferences[i]._id,
			{
				$inc: { totalLikes: !isInArrayOfLikes ? 1 : -1 },
			},
			{ new: true }
		);
	}

	const updatedMedia = await Media.findByIdAndUpdate(
		req.params.id,
		{
			likes: !isInArrayOfLikes
				? [...media.likes, req.user.id]
				: media.likes.filter((mediaId) => {
						return mediaId.toString() !== req.user.id;
				  }),
		},
		{ new: true }
	);

	res.status(200).json(updatedMedia);
});

const deleteMedia = asyncHandler(async (req, res) => {
	const references = await Character.find({ images: req.params.id });
	const media = await Media.findById(req.params.id);

	for (const i in references) {
		const removeReference = await Character.findByIdAndUpdate(
			references[i]._id,
			{ $pull: { images: req.params.id }, $inc: { totalLikes: -media.likes.length } },
			{ new: true }
		);
	}
	deleteImage(media.hash);
	await media.remove();

	res.status(200).json({ id: req.params.id });
});

module.exports = { getMedia, likeMedia, deleteMedia };
