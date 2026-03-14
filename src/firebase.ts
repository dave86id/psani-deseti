import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAbTU3Xg7blQpv6THlFtuDQpp2uIy-xrE",
  authDomain: "psani-deseti.firebaseapp.com",
  projectId: "psani-deseti",
  storageBucket: "psani-deseti.firebasestorage.app",
  messagingSenderId: "403379486785",
  appId: "1:403379486785:web:d0fc48c661f9e04f8546c0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
