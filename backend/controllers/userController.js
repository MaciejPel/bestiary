const jwt = require('jsonwebtoken');
const bcrpyt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Character = require('../models/characterModel');
const Media = require('../models/mediaModel');

const registerUser = asyncHandler(async (req, res) => {
	const { nick, password } = req.body;

	if (!nick || !password) {
		res.status(400);
		throw new Error('Please fill all fields');
	}

	if (nick.length < 3 || nick.length > 20 || password.length < 8 || password.length > 20) {
		res.status(400);
		throw new Error(
			`Nick ${
				nick.length < 3 || nick.length > 20
					? 'should have length between 3-20 characters'
					: 'has correct length'
			}. 
			Password ${
				password.length < 8 || password.length > 20
					? 'should have length between 8-20 characters'
					: 'has correct length'
			}.`
		);
	}

	const userExists = await User.findOne({ nick });
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const salt = await bcrpyt.genSalt(10);
	const hashedPassword = await bcrpyt.hash(password, salt);
	const user = await User.create({ nick, password: hashedPassword });

	if (user) {
		res.status(201).json({
			_id: user.id,
			nick: user.nick,
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

const loginUser = asyncHandler(async (req, res) => {
	const { nick, password } = req.body;

	const user = await User.findOne({ nick, verified: true });

	if (user && (await bcrpyt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			nick: user.nick,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
	}
});

const getMe = asyncHandler(async (req, res) => {
	if (!req.user.verified) {
		res.status(401);
		throw new Error('Account not verified');
	} else if (req.user.blocked) {
		res.status(401);
		throw new Error('Account suspended');
	} else {
		const user = await User.findById(req.user._id, { nick: 1 });
		res.status(200).json(user);
	}
});

const getUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id, { nick: 1, likes: 1, createdAt: 1 });
	const characters = await Character.countDocuments({ user: id });
	const media = await Media.countDocuments({ user: id });

	res.status(200).json({
		_id: user._id,
		nick: user.nick,
		createdAt: `${user.createdAt.getFullYear()}-${
			user.createdAt.getMonth() + 1 < 10
				? '0' + (user.createdAt.getMonth() + 1)
				: user.createdAt.getMonth() + 1
		}-${user.createdAt.getDate() < 10 ? '0' + user.createdAt.getDate() : user.createdAt.getDate()}`,
		characterCount: characters,
		mediaCount: media,
	});
});

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

module.exports = {
	registerUser,
	loginUser,
	getMe,
	getUser,
};
