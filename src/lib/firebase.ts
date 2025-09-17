// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6qM6TPUo_TKPc8sQbijpOSbhjR_Rf7qo",
  authDomain: "homebase-economy.firebaseapp.com",
  projectId: "homebase-economy",
  storageBucket: "homebase-economy.firebasestorage.app",
  messagingSenderId: "578501720700",
  appId: "1:578501720700:web:116ebb2f595baa345ee7f9"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
