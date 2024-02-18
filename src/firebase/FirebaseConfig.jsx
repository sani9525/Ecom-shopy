// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCmmNTn4CE0hPTewE0eocMvvA0w-YNZJY",
  authDomain: "ecome-shopy.firebaseapp.com",
  projectId: "ecome-shopy",
  storageBucket: "ecome-shopy.appspot.com",
  messagingSenderId: "1086787962373",
  appId: "1:1086787962373:web:8cfd31d40b3284b717fe6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app)
export {fireDB,auth } ;