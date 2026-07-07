// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBERJXhe8vT70lu0RKLfSz0571PfbTBicA",
  authDomain: "oandd-116b5.firebaseapp.com",
  projectId: "oandd-116b5",
  storageBucket: "oandd-116b5.firebasestorage.app",
  messagingSenderId: "1015861654341",
  appId: "1:1015861654341:web:5307eb430927a6275a442c",
  measurementId: "G-0GRFB9F8LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);