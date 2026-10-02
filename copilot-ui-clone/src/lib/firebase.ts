import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxbJ41pK89RCzA9mfugOKBDD7U9rFSM0s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smiling-surface-qdpgw.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smiling-surface-qdpgw",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smiling-surface-qdpgw.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "286485714466",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:286485714466:web:52c3d9deaeca389b88dc7b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-copilotuiclone-7575d91e-38aa-4742-bd4a-cde0891900f5");
export const auth = getAuth(app);
export const storage = getStorage(app);
