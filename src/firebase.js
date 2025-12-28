// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSHp792qk4m1l38zlXIDLHTdEEr6aa2to",
  authDomain: "swift-ride-4f080.firebaseapp.com",
  projectId: "swift-ride-4f080",
  storageBucket: "swift-ride-4f080.firebasestorage.app",
  messagingSenderId: "400619671340",
  appId: "1:400619671340:web:7f7b792a46b9bdab43a689"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { auth, googleProvider };
