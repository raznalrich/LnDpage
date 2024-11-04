import { database } from "../../js/Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const announcementContainer = document.getElementById("announcementContainer");
const showAllButton = document.getElementById("showAllButton");
const searchInput = document.getElementById("homeSearchInput");

let announcements = []; 

function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; 
        announcements = []; 
        const today = getTodayDate();

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const announcementDate = new Date(data.date);

                if (announcementDate >= today) {
                    announcements.push({
                        title: data.title,
                        date: announcementDate,
                        desc: data.desc,
                    });
                }
            });

            announcements.sort((a, b) => a.date - b.date);

            displayAnnouncements(announcements);
        } else {
            announcementContainer.innerHTML = "<p>No announcements found.</p>";
        }
    });
}

function displayAnnouncements(announcementList) {
    announcementContainer.innerHTML = ""; 
    announcementList.forEach(displayAnnouncement); 
}

function displayAnnouncement(announcement) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="icon-wrapper">
            <div class="red-circle">
                <div class="white-circle"></div>
            </div>
            <h3>${announcement.title}</h3>
        </div>
        <p>${announcement.date.toLocaleDateString()}</p>
        <p class="description">${announcement.desc}</p>
    `;
    announcementContainer.appendChild(card);
}

function displaySelectedAnnouncementByTitle(title) {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; 
        const today = getTodayDate();
        let found = false;

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const announcementDate = new Date(data.date);

                if (data.title === title && announcementDate >= today) {
                    const announcement = {
                        title: data.title,
                        date: announcementDate,
                        desc: data.desc,
                    };
                    displayAnnouncement(announcement);
                    found = true;
                }
            });
        }

        if (found) {
            showAllButton.style.display = "block";
        } else {
            announcementContainer.innerHTML = "<p>Announcement not found.</p>";
        }
    });
}

function filterAnnouncements() {
    const query = searchInput.value.toLowerCase();
    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(query)
    );
    displayAnnouncements(filteredAnnouncements); 
}

searchInput.addEventListener("input", filterAnnouncements);

const title = getQueryParam("title");
if (title) {
    displaySelectedAnnouncementByTitle(decodeURIComponent(title)); 
} else {
    fetchAnnouncements(); 
}

showAllButton.addEventListener("click", () => {
    announcementContainer.innerHTML = ""; 
    showAllButton.style.display = "none";
    fetchAnnouncements();
});
