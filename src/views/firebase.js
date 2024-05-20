// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChIsoH_qwGXmH5esnqCPMY0Vxe1Eshm0w",
  authDomain: "fir-fcbe5.firebaseapp.com",
  projectId: "fir-fcbe5",
  storageBucket: "fir-fcbe5.appspot.com",
  messagingSenderId: "874485341032",
  appId: "1:874485341032:web:51d63d14ebb0b32f1ed4dd",
  measurementId: "G-0LGKZ6LJMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

