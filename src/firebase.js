// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, gettAuth} from "firebase/auth"
import {Firestore, getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcb04pQjMEK16bKNXyoYIcN_1E-Nl3bV8",
  authDomain: "auth-37d15.firebaseapp.com",
  projectId: "auth-37d15",
  storageBucket: "auth-37d15.appspot.com",
  messagingSenderId: "176373370197",
  appId: "1:176373370197:web:3ac0c85e96265c2a8733dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);



export {app , auth , db , storage}