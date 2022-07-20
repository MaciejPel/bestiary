const asyncHandler = require('express-async-handler');
const { ImgurClient } = require('imgur');
const { Readable } = require('stream');

const ImgClient = new ImgurClient({
	clientId: process.env.IMGUR_CLIENT_ID,
	clientSecret: process.env.IMGUR_CLIENT_SECRET,
	refreshToken: process.env.IMGUR_REFRESH_TOKEN,
	accessToken: process.env.IMGUR_ACCESS_TOKEN,
});

const uploadImage = asyncHandler(async (name, data) => {
	const response = await ImgClient.upload({
		image: Readable.from(data),
		title: name,
		type: 'stream',
	});

	return response.data.id;
});

const deleteImage = asyncHandler(async (hash) => {
	const album = await ImgClient.deleteImage(hash);
	return album;
});

module.exports = { uploadImage, deleteImage };

// METHODS:
// plainRequest;
// request;
// deleteImage;
// favoriteImage;
// getAlbum;
// getAccount;
// getAlbums;
// createAlbum;
// getAlbumsIds;
// getGallery;
// getSubredditGallery;
// searchGallery;
// getImage;
// updateImage;
// upload;
