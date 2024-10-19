import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "../../js/admin/Firebase.js";

const auth = getAuth(app);  // Initialize Firebase Authentication

// reset password/ forgot password
const resetPasswordForm = document.getElementById('resetForm');
const successMessage = document.getElementById('success-message-reset');
const errorMessage = document.getElementById('error-message-reset');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const adminEmail = document.getElementById('adminEmail').value

    try {
        await sendPasswordResetEmail(auth, adminEmail)
        successMessage.textContent = 'Password reset link sent to ${adminEmail}';
        errorMessage.textContent = "";
    } catch (error) {
        errorMessage.textContent = `Error : ${error.message}`;
        successMessage.textContent = "";
    }
})