// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PRIVATE_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PRIVATE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PRIVATE_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PRIVATE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PRIVATE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});
const storage = getStorage(app);

export { app, auth, db, storage };
