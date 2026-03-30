import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6XCalNL_V_ycJpnMwnl4JNe_5bNjrkkQ",
  authDomain: "codenyx-57d41.firebaseapp.com",
  projectId: "codenyx-57d41",
  storageBucket: "codenyx-57d41.firebasestorage.app",
  messagingSenderId: "1053118220379",
  appId: "1:1053118220379:web:61cb502bfd89efde73d77e",
  measurementId: "G-K2VWK8GHL4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
