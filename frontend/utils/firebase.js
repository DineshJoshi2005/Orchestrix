// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "orchestrix-bd8a4.firebaseapp.com",
    projectId: "orchestrix-bd8a4",
    storageBucket: "orchestrix-bd8a4.firebasestorage.app",
    messagingSenderId: "822076228701",
    appId: "1:822076228701:web:754569c3983253c9d1b9b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()