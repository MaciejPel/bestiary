const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		hash: {
			type: String,
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
		fileType: {
			type: String,
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
