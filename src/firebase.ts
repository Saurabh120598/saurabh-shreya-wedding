import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMpmvU-Bgnz4XuGWUs6vWdiuR6nv5-JhQ",
  authDomain: "saurabh-shreya-wedding.firebaseapp.com",
  projectId: "saurabh-shreya-wedding",
  storageBucket: "saurabh-shreya-wedding.firebasestorage.app",
  messagingSenderId: "656138657379",
  appId: "1:656138657379:web:e2ce1d3936f1b073e6e256"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
