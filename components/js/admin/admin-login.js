import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "../../js/admin/Firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
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
                window.location.href = "../../pages/admin/Admin-SideBar/adminSideBarMain.html"
            } else {
                alert("Access denied! You are not an admin.");
                await auth.signOut();
            }
        } else {
            throw new Error("No user data found");
        }
    } catch (error) {
        const password = document.getElementById('password');
        const email = document.getElementById('email');
        password.style.borderColor = 'red';
        email.style.borderColor = 'red';
        const error_password = document.getElementById('error');
        const error_email = document.getElementById('error');
        error_password.style.display = 'block';
        error_email.style.display = 'block';
    }
});