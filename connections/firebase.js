const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDGSf4WTJdh8nq8jmFncVTOGO5cMkHrvBA",
  authDomain: "of-experiences.firebaseapp.com",
  databaseURL: "https://of-experiences-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "of-experiences",
  storageBucket: "of-experiences.appspot.com",
  messagingSenderId: "184218624803",
  appId: "1:184218624803:web:2716592e53d32ccad9e296"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

module.exports = db;
