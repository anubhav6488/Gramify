const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAXQjvmCglHyQYzBxyGMA46IdbKHBcIxeo",
  authDomain: "gramify-anubhav.firebaseapp.com",
  projectId: "gramify-anubhav",
  storageBucket: "gramify-anubhav.appspot.com",
  messagingSenderId: "556809714050",
  appId: "1:556809714050:web:908e2aa3c271089c24779b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
