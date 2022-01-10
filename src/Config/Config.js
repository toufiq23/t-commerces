import firebase from "firebase"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const fs = firebaseApp.firestore()
const storage = firebase.storage()

export {auth, fs, storage}