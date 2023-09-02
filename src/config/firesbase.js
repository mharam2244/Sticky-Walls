// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD53WMgmvM7PCRJgEaNiXlHNssGrassea4",
  authDomain: "sticks-9776c.firebaseapp.com",
  projectId: "sticks-9776c",
  storageBucket: "sticks-9776c.appspot.com",
  messagingSenderId: "919884086522",
  appId: "1:919884086522:web:521de332176af2b817dd43",
  measurementId: "G-M7XZJ9J3B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
const auth = getAuth(app)


export {firestore , auth}