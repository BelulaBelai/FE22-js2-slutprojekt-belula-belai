
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvwo_PXtVUvr1LcHw7peEA0y4QDe0XFQU",
  authDomain: "social-media-app-4f6cb.firebaseapp.com",
  projectId: "social-media-app-4f6cb",
  storageBucket: "social-media-app-4f6cb.firebasestorage.app",
  messagingSenderId: "612809842080",
  appId: "1:612809842080:web:ab6504a48752f037e9d8c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function initFirebase() {
  return { auth, db };
}
