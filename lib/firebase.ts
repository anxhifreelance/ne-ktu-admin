import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqoDKMKoUuUdGEGf94RUJlYhYGY7S-bbQ",
  authDomain: "ne-ktu-827cf.firebaseapp.com",
  projectId: "ne-ktu-827cf",
  storageBucket: "ne-ktu-827cf.firebasestorage.app",
  messagingSenderId: "523029269910",
  appId: "1:523029269910:web:75147cba12ce0f12f361b7",
  measurementId: "G-NQQ2495CMV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
