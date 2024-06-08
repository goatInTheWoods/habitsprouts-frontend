import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAYH0DM2qsBPcNB-UlHSXC7ntJLBYwQACc',
  authDomain: 'habitsprouts-423500.firebaseapp.com',
  projectId: 'habitsprouts-423500',
  storageBucket: 'habitsprouts-423500.appspot.com',
  messagingSenderId: '417053899023',
  appId: '1:417053899023:web:067e0b7da98fee0e6fe67a',
  measurementId: 'G-YJFD3FQZXE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleSignOut = signOut(auth);
const googleProvider = new GoogleAuthProvider();

export { auth, googleSignOut, signInWithPopup, googleProvider };
