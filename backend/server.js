const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
// require('./config/imgurAPI');

// connectDB();
const app = express();
app.use(express.json());
app.use(fileUpload());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(
// 	helmet.contentSecurityPolicy({
// 		useDefaults: true,
// 		directives: {
// 			'img-src': ["'self'", 'https: data:'],
// 		},
// 	})
// );
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/characters', require('./routes/characterRoutes'));
// app.use('/api/media', require('./routes/mediaRoutes'));

if (process.env.ENVIRONMENT === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'))
	);
} else {
	app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(process.env.PORT || 5000);
