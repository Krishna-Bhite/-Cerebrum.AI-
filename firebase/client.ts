// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLbe3zkmH3AxA4cJTQuthjP6ufNjaw3Ec",
  authDomain: "cerebrum-213f4.firebaseapp.com",
  projectId: "cerebrum-213f4",
  storageBucket: "cerebrum-213f4.firebasestorage.app",
  messagingSenderId: "984402589739",
  appId: "1:984402589739:web:8a99f17020fd53a915126e",
  measurementId: "G-EW0HB4RC4S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);