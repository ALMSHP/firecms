
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCe8jfZ_u-4u1HJZUdmt40wjy5VDKB3ook",
    authDomain: "wizzy-b4239.firebaseapp.com",
    projectId: "wizzy-b4239",
    storageBucket: "wizzy-b4239.firebasestorage.app",
    messagingSenderId: "622923747842",
    appId: "1:622923747842:web:18b39bf89c69f6441e8d1b",
    measurementId: "G-8657R0VL5W"
};

// Initialize Firebase app (singleton pattern)
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firestore instance
export const db = getFirestore(firebaseApp);
