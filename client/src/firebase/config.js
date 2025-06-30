// client/src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBNKrpS2uCyfuUuk5sEEkCnVzC-WxUya0g",
  authDomain: "cineai-recommendation-platform.firebaseapp.com",
  projectId: "cineai-recommendation-platform",
  storageBucket: "cineai-recommendation-platform.firebasestorage.app",
  messagingSenderId: "27360953595",
  appId: "1:27360953595:web:c9c58dd5629ed806449c5e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
