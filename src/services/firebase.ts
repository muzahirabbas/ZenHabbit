import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6KGFkIT0atlfrjK4FHXl2HiuVR-5Qsbg",
  authDomain: "zenhabbit-df166.firebaseapp.com",
  projectId: "zenhabbit-df166",
  storageBucket: "zenhabbit-df166.firebasestorage.app",
  messagingSenderId: "460758412252",
  appId: "1:460758412252:web:c28e5be522b6dc30483d19",
  measurementId: "G-WNV5Q93XJ6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();