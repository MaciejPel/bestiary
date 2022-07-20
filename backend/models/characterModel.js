const mongoose = require('mongoose');

const characterSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: [true, 'Please add name value'],
		},
		images: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Media',
			},
		],
		totalLikes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Character', characterSchema);
