
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChIsoH_qwGXmH5esnqCPMY0Vxe1Eshm0w",
  authDomain: "fir-fcbe5.firebaseapp.com",
  projectId: "fir-fcbe5",
  storageBucket: "fir-fcbe5.appspot.com",
  messagingSenderId: "874485341032",
  appId: "1:874485341032:web:51d63d14ebb0b32f1ed4dd",
  measurementId: "G-0LGKZ6LJMS"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

