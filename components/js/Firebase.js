// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import {
  child,
  get,
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfJElqVOr3xNcN_HpB0UILqOQuyIl_euQ",
  authDomain: "l-and-d-website.firebaseapp.com",
  projectId: "l-and-d-website",
  storageBucket: "l-and-d-website.firebasestorage.app",
  messagingSenderId: "859956440280",
  appId: ":859956440280:web:470892a4e6749bda843bad",
  measurementId: "G-VKY6XWE5S5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app1 = initializeApp(firebaseConfig,"app1");
const analytics = getAnalytics(app);
const storage = getStorage(app);
const database = getDatabase(app);
export { storage, database, child, get, ref, app, app1 };
