import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBncSXpPMyBwt3_GI9kLb40akkyhmeZtg4",
  authDomain: "ne-ktu-c2e56.firebaseapp.com",
  projectId: "ne-ktu-c2e56",
  storageBucket: "ne-ktu-c2e56.firebasestorage.app",
  messagingSenderId: "428944891144",
  appId: "1:428944891144:web:33590061ddfeee85dd20bd",
  measurementId: "G-5CSB3YYHHM",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
