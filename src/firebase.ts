import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0ec8b9o25FdLHE_aoYKwr6wLRgJ2SRuQ",
    authDomain: "tasks-78236.firebaseapp.com",
    projectId: "tasks-78236",
    storageBucket: "tasks-78236.firebasestorage.app",
    messagingSenderId: "798644454185",
    appId: "1:798644454185:web:5c725b65e0b5f9c97f2d38",
    measurementId: "G-4P70EBE3T9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User Info:", user);
    return user;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

export { auth, signInWithGoogle, logout, db, provider };
