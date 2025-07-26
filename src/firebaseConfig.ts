import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu4UA4IjuVxC_bnr7Yn55qyB5P8ZWJhZk",
  authDomain: "med-2870d.firebaseapp.com",
  projectId: "med-2870d",
  storageBucket: "med-2870d.firebasestorage.app",
  messagingSenderId: "11019310072",
  appId: "1:11019310072:web:f202d0ff68212b6cb1fc0d",
  measurementId: "G-F5PFT711P2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;