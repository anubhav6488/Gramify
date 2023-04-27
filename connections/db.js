const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const admin = require("firebase-admin");

const serviceAccount = require("../keys/" + stage.private_key_path);

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}, 'node').firestore();

module.exports = db;
