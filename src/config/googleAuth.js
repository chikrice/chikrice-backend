const { google } = require('googleapis');

const config = require('./config');

const { clientId, clientSecret } = config.google;

const redirectUri = config.env === 'development' ? 'http://localhost:3030' : 'https://chikrice.khaled-javdan.com';

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

module.exports = { oAuth2Client };
