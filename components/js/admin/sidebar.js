import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "../../js/admin/Firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

let bannerImage = document.getElementById("bannerImage");
let announcement = document.getElementById("bannerImage");
let newsLetter = document.getElementById("bannerImage");
let calendar = document.getElementById("bannerImage");
let leaderInsight = document.getElementById("bannerImage");
let galleryImport = document.getElementById("bannerImage");
let menuItems = document.getElementById("bannerImage");


document.getElementById("bannerImage").addEventListener("click", showBannerImage);
document.getElementById("announcement").addEventListener("click", showAnnouncement);
document.getElementById("newsLetter").addEventListener("click", showNewsLetter);
// document.getElementById("calendar").addEventListener("click", showCalendarEvents);
document.getElementById("leaderInsight").addEventListener("click", showLeaderInsights);
document.getElementById("galleryImport").addEventListener("click", showGallery);
document.getElementById("menuItems").addEventListener("click", showMenuItems);


let maincontent = document.getElementById("maincontent")
let iframe = ''

function removeAllClasses() {
    document.getElementById("bannerImage").classList.remove('announce-btn');
    document.getElementById("announcement").classList.remove('announce-btn');
    document.getElementById("newsLetter").classList.remove('announce-btn');
    // document.getElementById("calendar").classList.remove('announce-btn');
    document.getElementById("leaderInsight").classList.remove('announce-btn');
    document.getElementById("galleryImport").classList.remove('announce-btn');
    document.getElementById("menuItems").classList.remove('announce-btn');
}

function showBannerImage() {
    removeAllClasses();

    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./Admin-sideBar.html";
    iframe.width = '100%';
    iframe.height = '550px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("bannerImage").classList.add('announce-btn')
}
function showAnnouncement() {

    removeAllClasses();
    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./Admin-announce.html";
    iframe.width = '100%';
    iframe.height = '550px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("announcement").classList.add('announce-btn')
}
function showNewsLetter() {

    removeAllClasses();
    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./newsLetter.html";
    iframe.width = '100%';
    iframe.height = '550px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("newsLetter").classList.add('announce-btn')
}

function showLeaderInsights() {

    removeAllClasses();
    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./leaderInsight.html";
    iframe.width = '100%';
    iframe.height = '550px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("leaderInsight").classList.add('announce-btn')
}
function showGallery() {

    removeAllClasses();
    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./Gallery.html";
    iframe.width = '100%';
    iframe.height = '550px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("galleryImport").classList.add('announce-btn')
}
function showMenuItems() {

    removeAllClasses();
    let existingIframe = document.querySelector('iframe');


    if (existingIframe) {
        existingIframe.remove();
    }

    let iframe = document.createElement('iframe');
    iframe.src = "./MenuItems.html";
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.style.border = 'none';
    maincontent.appendChild(iframe);
    document.getElementById("menuItems").classList.add('announce-btn')
}

showBannerImage();


// onAuthStateChanged(auth, async (user) => {
//     if (user) {

//         const userDocRef = doc(db, "users", user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//             const userData = userDoc.data();
//             console.log("User data:", userData);
          
//         } else {
//             console.error("User data not found.");
//         }
//     } else {
       
//         console.log("No user logged in.");
//         window.location.href = "../../pages/admin/login.html";
//     }
// });

//Logout function
document.getElementById("logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
            window.location.href = "../../../pages/admin/login.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log("User is signed in:", user.email);
//     } else {
//         window.location.href = "../../../pages/admin/login.html";
//     }
// });