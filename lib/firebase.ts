import { initializeApp, getApps, getApp } from "@firebase/app";
import { getAnalytics, isSupported } from "@firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBERJXhe8vT70lu0RKLfSz0571PfbTBicA",
  authDomain: "oandd-116b5.firebaseapp.com",
  projectId: "oandd-116b5",
  storageBucket: "oandd-116b5.firebasestorage.app",
  messagingSenderId: "1015861654341",
  appId: "1:1015861654341:web:5307eb430927a6275a442c",
  measurementId: "G-0GRFB9F8LM"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize analytics safely for client-side
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported: boolean) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch {
          // Ignore analytics failures when offline
        }
      }
    })
    .catch(() => {
      // Ignore network fetch errors when offline
    });
}

export { app, db, auth, googleProvider, analytics };