const { google } = require('googleapis');
const { GOOGLE_API_KEY } = require('./dotenv.config');

const calendar = google.calendar({ version: 'v3', auth: GOOGLE_API_KEY });

module.exports = calendar;
