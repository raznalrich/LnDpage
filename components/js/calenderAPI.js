// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const secondfirebaseConfig = {
  apiKey: "AIzaSyB56Ttr01dSS6C1JR1zZEX0-quWTfiq77M",
  authDomain: "training-calendar-ilp05.firebaseapp.com",
  databaseURL:
    "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-calendar-ilp05",
  storageBucket: "training-calendar-ilp05.appspot.com",
  messagingSenderId: "180932006030",
  appId: "1:180932006030:web:6fbca66b630a312eb179df",
  measurementId: "G-NBQVMQW0VL",
};

const secondapp = initializeApp(secondfirebaseConfig);
const analytics = getAnalytics(secondapp);
const storage = getStorage(secondapp);
const database = getDatabase(secondapp);
export { storage, database, child, get, ref, secondapp }

// Export the initialized services for use in other modules

