import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQI_s3T7gbGxRZIWEtIQsCXqGv4LybYSU",
  authDomain: "quickdesk-b6cfc.firebaseapp.com",
  projectId: "quickdesk-b6cfc",
  storageBucket: "quickdesk-b6cfc.firebasestorage.app",
  messagingSenderId: "851421895230",
  appId: "1:851421895230:web:475c676cd2e7bcd36d8f6f",
  measurementId: "G-J563GXQWGY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);