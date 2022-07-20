const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		nick: {
			type: String,
			required: [true, 'Please enter a nick'],
			unique: true,
			minlength: [3, 'Minimum nick length is 3 characters'],
		},
		password: {
			type: String,
			required: [true, 'Please enter a password'],
			minlength: [6, 'Minimum password length is 6 characters'],
		},
		verified: {
			type: Boolean,
			default: false,
		},
		blocked: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
