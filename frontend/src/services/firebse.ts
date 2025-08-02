// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQI_s3T7gbGxRZIWEtIQsCXqGv4LybYSU",
  authDomain: "quickdesk-b6cfc.firebaseapp.com",
  projectId: "quickdesk-b6cfc",
  storageBucket: "quickdesk-b6cfc.firebasestorage.app",
  messagingSenderId: "851421895230",
  appId: "1:851421895230:web:475c676cd2e7bcd36d8f6f",
  measurementId: "G-J563GXQWGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);