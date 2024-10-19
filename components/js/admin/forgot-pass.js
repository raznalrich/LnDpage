import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "./Firebase.js";

// reset password/ forgot password
const resetPasswordForm = document.getElementById('resetForm');
const successMessage = document.getElementById('success-message-reset');
const errorMessageReset = document.getElementById('error-message-reset');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const adminEmail = getElementById('adminEmail').value

    try {
        await sendPasswordResetEmail(auth, adminEmail)
        successMessage = 'Password reset link sent to ${adminEmail}';
        errorMessage.textContent = "";
    } catch (error) {
        errorMessage.textContent = `Error : ${error.message}`;
        successMessage.textContent = "";
    }
})