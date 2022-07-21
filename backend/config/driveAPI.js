// const { google } = require('googleapis');
// const asyncHandler = require('express-async-handler');
// const { Readable } = require('stream');

// const auth = new google.auth.GoogleAuth({
// 	keyFile: 'credentials.json',
// 	scopes: ['https://www.googleapis.com/auth/drive'],
// });
// const drive = google.drive({ version: 'v3', auth });

// const getFileByName = asyncHandler(async (name, folder) => {
// 	const folderID = await drive.files.list({
// 		q: `name = '${name}' ${folder ? "and mimeType='application/vnd.google-apps.folder'" : ''}`,
// 	});

// 	return folderID.data.files[0].id;
// });

// const listFilesInFolder = asyncHandler(async (name) => {
// 	const folderID = await getFileByName(name, true);

// 	const response = await drive.files.list({ q: `'${folderID}' in parents` });

// 	return response.data.files;
// });

// const createCharacterFolder = asyncHandler(async (name) => {
// 	const mainFolderId = await getFileByName('Bestiary', true);

// 	const folderMetadata = {
// 		name,
// 		parents: [mainFolderId],
// 		mimeType: 'application/vnd.google-apps.folder',
// 	};

// 	const folder = await drive.files.create({
// 		fields: 'id',
// 		resource: folderMetadata,
// 	});

// 	return folder.data.id;
// });

// const uploadImage = asyncHandler(async (name, data, mimeType) => {
// 	const mainFolderId = await getFileByName('Bestiary', true);

// 	const file = await drive.files.create({
// 		resource: { name, parents: [mainFolderId] },
// 		name,
// 		media: { mimeType, body: Readable.from(data) },
// 		fields: 'id',
// 	});
// 	const fileId = file.data.id;

// 	await drive.permissions.create({
// 		fileId,
// 		requestBody: {
// 			role: 'reader',
// 			type: 'anyone',
// 		},
// 	});

// 	return fileId;
// });

// const emptyTrash = asyncHandler(async () => {
// 	await drive.files.emptyTrash();
// });

// module.exports = { listFilesInFolder, createCharacterFolder, uploadImage };
