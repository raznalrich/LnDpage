const monthDisplay = document.getElementById("monthDisplay");
const eventContainer = document.getElementById("eventContainer");
const searchInput = document.getElementById("searchInput");
import { database ,ref} from "../Firebase.js";
import { child, get, getDatabase, set, update, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


// === Fetch & Preview Calendar Image ===
window.getCalendarImage = async function () {
    const calendarImageRef = dbRef(database, "calendarImage");

    try {
        const snapshot = await get(calendarImageRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const preview = document.getElementById("calendarImagePreview");
            preview.innerHTML = `<img src="${data.url}" style="width:1000px;height:auto;" />`;
        } else {
            console.log("No calendar image found in DB");
        }
    } catch (error) {
        console.error("Error fetching calendar image:", error);
    }
};


function getSidebarAnnouncements(){
  const sidebar = document.querySelector("#pageSideBar .announcement-list");
  const dref = ref(database);

  get(child(dref,"announcement")).then((announce) => {
        let announcementsArray = [];
        announce.forEach(announcement => {
            let announcementDate = announcement.child("date").val();
            let announcementDesc = announcement.child("desc").val();
            let announcementTitle = announcement.child("title").val();
            let announcementUrl = announcement.child("url").val();

           announcementsArray.push({
        date: new Date(announcementDate),
        title: announcementTitle,
        desc: announcementDesc,
        url: announcementUrl,
      }); 
        });
        announcementsArray.sort((a, b) => b.date - a.date);

    // Limit to 3
    const limited = announcementsArray.slice(0, 3);

    // Clear existing
    sidebar.innerHTML = "";

    limited.forEach((a) => {
      const li = document.createElement("li");

      // If URL exists → wrap title in <a>
      const title = a.url
        ? `<a href="${a.url}" target="_blank"><h3>${a.title}</h3></a>`
        : `<h3>${a.title}</h3>`;

      li.innerHTML = `
        ${title}
        <p>${a.desc}</p>
      `;

      sidebar.appendChild(li);
    });
  })
}
//image
function getPhotoGallery(){
  const sidebarpic = document.querySelector("#gallery-preview-list .photo-list");
  const dref = ref(database);

  get(child(dref,"files")).then((announce) => {
        let announcementsArray = [];
        announce.forEach(announcement => {
            let fileCategory = announcement.child("fileCat").val();
            let fileDesc = announcement.child("fileDesc").val();
            let fileName = announcement.child("fileName").val();
            let fileURL = announcement.child("fileURL").val();

           announcementsArray.push({
        category: fileCategory,
        title: fileName,
        desc: fileDesc,
        url: fileURL,
      }); 
        });
        console.log(announcementsArray);
        
        announcementsArray.sort((a, b) => b.date - a.date);

    // Limit to 3
    const limited = announcementsArray.slice(0, 3);
            console.log(limited);


    // Clear existing
    sidebarpic.innerHTML = "";

    limited.forEach((a) => {
      const li = document.createElement("li");

        li.innerHTML = `
    <div class="gallery-item">
      <img src="${a.url}" alt="${a.title}" />
      <p>${a.desc}</p>
    </div>
  `;

      sidebarpic.appendChild(li);
    });
  })
}

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
// Event Listeners
// -------------------------
announcementButton.addEventListener('mouseenter', showNotification);
announcementButton.addEventListener('mouseleave', hideNotification);
announcementContainer.addEventListener('mouseleave', hideNotification);

// -------------------------
// DOMContentLoaded
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    updateAnnouncementBadge();
    addNotifications();
});
// Run on page load
getCalendarImage();
getSidebarAnnouncements();
getPhotoGallery();
