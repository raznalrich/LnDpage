import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "../../js/admin/Firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('loginForm');
// const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.role === "admin") {
                alert("Welcome, Admin!");
                // window.location.href = "../../pages/admin/adminMenuItems.html";
                window.location.href = "../../pages/admin/Admin-SideBar/adminSideBarMain.html"
            } else {
                alert("Access denied! You are not an admin.");
                auth.signOut();
                window.location.href = "/access-denied.html";
            }
        } else {
            throw new Error("No user data found");
        }
    } catch (error) {
        // errorMessage.textContent = `Error: ${error.message}`;
        const password_field = document.getElementById('password');
        password_field.style.borderColor = 'red';
        const error_password = document.getElementById('error-pass');
        error_password.style.display = 'block';
    }
});
