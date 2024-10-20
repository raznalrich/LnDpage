import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "../js/Firebase.js";

const auth = getAuth(app);  // Initialize Firebase Authentication
const db = getFirestore(app);  // Initialize Firestore

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevents default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Sign in the user using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user has an admin role in Firestore
        const userDocRef = doc(db, "users", user.uid);  // Reference to the user's Firestore document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.role === "admin") {
                alert("Welcome, Admin!");
                window.location.href = "../../pages/admin/gallery.html";  // You can change this URL to the actual dashboard page
            } else {
                alert("Access denied! You are not an admin.");
                auth.signOut();  // Log out the user if they are not an admin
                window.location.href = "/access-denied.html";  // Redirect to an "Access Denied" page if needed
            }
        } else {
            throw new Error("No user data found");
        }
    } catch (error) {
        errorMessage.textContent = error.message;  // Display any authentication errors
    }
});
