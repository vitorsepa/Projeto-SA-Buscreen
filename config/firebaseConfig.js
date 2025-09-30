const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json'); // arquivo gerado no Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

module.exports = admin;
