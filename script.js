import { storage, database } from "./components/js/Firebase.js";
import { ref as dbRef, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


// DOM Elements
const badgeElement = document.getElementById('badge');
const announcementContainer = document.getElementById('announcement-hover');
const announcementButton = document.getElementById('announcement');

let hideTimeout;
let events = [];

// -------------------------
// Utility: Today's Date
// -------------------------
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

// -------------------------
// Update Announcement Badge
// -------------------------
async function updateAnnouncementBadge() {
    try {
        const date = new Date();
        let month = date.getMonth() + 1;
        if (month < 10) month = '0' + month;

        const announcementsRef = dbRef(database, 'announcement');
        const snapshot = await get(announcementsRef);

        let notificationCount = 0;
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(data);
            
            for (const key in data) {
                const announcement = data[key];
                let announcementMonth = parseInt(announcement.date.substring(5, 7),10);
                
                if (announcementMonth === month){

                    notificationCount++;
                } 
                console.log(notificationCount);
                
            }
        }
        badgeElement.textContent = notificationCount;
    } catch (err) {
        console.error("Error updating badge:", err);
    }
}

// -------------------------
// Notification Hover
// -------------------------
function showNotification() {
    clearTimeout(hideTimeout);
    announcementContainer.style.display = 'block';
}

function hideNotification() {
    hideTimeout = setTimeout(() => {
        announcementContainer.style.display = 'none';
    }, 300);
}

// -------------------------
// Display Latest Announcements (up to 4)
// -------------------------
async function addNotifications() {
    try {
        const announcementsRef = dbRef(database, 'announcement');
        const snapshot = await get(announcementsRef);
        if (!snapshot.exists()) return;

        const data = Object.values(snapshot.val());
        const latestData = data.slice(-4); // Last 4 announcements

        // Clear container
        announcementContainer.innerHTML = '';

        latestData.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('announcement-section');
            div.innerHTML = `
                <div class='notification-icon'>
                    <img src="https://firebasestorage.googleapis.com/v0/b/lndvconnect-6f4ac.appspot.com/o/assets%2Fbell-solid%20(1)%202.svg?alt=media&token=000dff85-5e44-4f10-8e4d-7884fbbddeca" alt="NOT FOUND">
                </div>
                <div class='notification-description'>
                    <h4>${item.title}</h4>
                </div>
            `;
            announcementContainer.appendChild(div);
        });
    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}

// -------------------------
// Fetch Upcoming Events (up to 4)
// -------------------------
// async function addEvents() {
//     try {
//         const response = await fetch(databaseURL);
//         const data = await response.json();
//         events = Object.keys(data).map(key => ({
//             title: data[key].courseName,
//             start: data[key].startDate
//         }));

//         events.sort((a, b) => new Date(a.start) - new Date(b.start));

//         const today = new Date();
//         const upcomingEvents = events.filter(event => new Date(event.start) > today).slice(0, 4);

//         upcomingEvents.forEach(event => {
//             const div = document.createElement('div');
//             div.classList.add('event-section');
//             div.innerHTML = `
//                 <div class='event-icon'>
//                     <img src="components/assets/calendar-regular (1) 2.svg" alt="NOT FOUND">
//                 </div>
//                 <div class='notification-description'>
//                     <h4>${event.title}</h4>
//                 </div>
//             `;
//             announcementContainer.appendChild(div);
//         });

//     } catch (error) {
//         console.error("Error fetching events:", error);
//     }
// }

// -------------------------
// Event Listeners
// -------------------------
announcementButton.addEventListener('mouseenter', showNotification);
announcementButton.addEventListener('mouseleave', hideNotification);
announcementContainer.addEventListener('mouseenter', showNotification);
announcementContainer.addEventListener('mouseleave', hideNotification);

// -------------------------
// DOMContentLoaded
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    updateAnnouncementBadge();
    addNotifications();
});
