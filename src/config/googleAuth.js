const { google } = require('googleapis');

const config = require('./config');

const { clientId, clientSecret, redirectUri } = config.google;
console.log(redirectUri);

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

module.exports = { oAuth2Client };
