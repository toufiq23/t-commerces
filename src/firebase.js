// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8ceJ0xeHUwvhjAU2SPuuIyhFOV1TuJMU",
  authDomain: "t-commerces.firebaseapp.com",
  projectId: "t-commerces",
  storageBucket: "t-commerces.appspot.com",
  messagingSenderId: "1023133835672",
  appId: "1:1023133835672:web:b905d537a54e2c67b4cbed",
  measurementId: "G-7JP3LDNR1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);