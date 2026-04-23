import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8TFitMZgSTmxTTIaeCznwN2CpzWoQ6Bc",
  authDomain: "booksdev-3de79.firebaseapp.com",
  databaseURL: "https://booksdev-3de79-default-rtdb.firebaseio.com",
  projectId: "booksdev-3de79",
  storageBucket: "booksdev-3de79.firebasestorage.app",
  messagingSenderId: "39273829148",
  appId: "1:39273829148:web:cbb6d02d4597025e09a0d9",
  measurementId: "G-5Q3BCRZEBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional, we might not need it for basic functionality

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

// Initialize Parse (Back4App)
Parse.initialize("hMZBazfLxDOjSPGgRvzBZxKedFCC0iDEJgEDquR4", "W3eRuk8fOdI1z9MDASo4ONJXGd8r2V8bpmzC4fQH");
Parse.serverURL = 'https://parseapi.back4app.com/';

export { signInWithPopup, signOut, onAuthStateChanged, ref, uploadBytes, getDownloadURL };
