const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAXQjvmCglHyQYzBxyGMA46IdbKHBcIxeo",
  authDomain: "gramify-anubhav.firebaseapp.com",
  projectId: "gramify-anubhav",
  storageBucket: "gramify-anubhav.appspot.com",
  messagingSenderId: "556809714050",
  appId: "1:556809714050:web:908e2aa3c271089c24779b",
  // apiKey: "AIzaSyAxnjZk50PH1szrAUrOQkB0X-K5s-JL1PM",
  // authDomain: "staging-ofex.firebaseapp.com",
  // projectId: "staging-ofex",
  // storageBucket: "staging-ofex.appspot.com",
  // messagingSenderId: "11892327779",
  // appId: "1:11892327779:web:81e1e0c56b4d225d5aff56"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
