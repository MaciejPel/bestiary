const fs = require('fs');
const file = 'credentials.json';

const credentials = {
	type: 'service_account',
	project_id: `${process.env.GOOGLE_PROJECT_ID}`,
	private_key_id: `${process.env.GOOGLE_PRIVATE_KEY_ID}`,
	private_key: `${process.env.GOOGLE_PRIVATE_KEY}`,
	client_email: `${process.env.GOOGLE_CLIENT_EMAIL}`,
	client_id: `${process.env.GOOGLE_CLIENT_ID}`,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: `${process.env.GOOGLE_CLIENT_X509_CERT_URL}`,
};

const genereateCredentials = () => {
	if (!fs.existsSync(file)) {
		fs.writeFileSync(file, JSON.stringify(credentials, null, 2).replace(/\\\\/g, '\\'));
		console.log('File created');
		return true;
	}
	console.log('File already exists');
	return false;
};

module.exports = { genereateCredentials };
