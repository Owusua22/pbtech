// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAN7iVt4RZZY82z1lSxPNxzljaCw0t4YXY",
  authDomain: "p-btech.firebaseapp.com",
  projectId: "p-btech",
  storageBucket: "p-btech.firebasestorage.app",
  messagingSenderId: "163754520231",
  appId: "1:163754520231:web:8d0472e29508cd1d65b582"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize storage
const storage = getStorage(app);

export { storage };
