import { database } from "../../js/Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const announcementContainer = document.getElementById("announcementContainer");
const searchInput = document.getElementById("searchInput");

let announcements = [];

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


function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; 
        announcements = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const announcement = {
                    title: data.title,
                    date: new Date(data.date), 
                    desc: data.desc,
                };
                announcements.push(announcement); 

                displayAnnouncement(announcement); 
            });
        } else {
            const message = document.createElement("p");
            message.innerText = "No announcements found.";
            announcementContainer.appendChild(message);
        }
    });
}

function filterAnnouncements() {
    const query = searchInput.value.toLowerCase(); 
    announcementContainer.innerHTML = ""; 

    const filteredAnnouncements = announcements.filter(announcement => {
        return announcement.title.toLowerCase().includes(query) || 
               announcement.date.toLocaleDateString().includes(query);
    });

    if (filteredAnnouncements.length > 0) {
        filteredAnnouncements.forEach(displayAnnouncement);
    } else {
        const message = document.createElement("p");
        message.innerText = "No announcements found.";
        announcementContainer.appendChild(message);
    }
}

searchInput.addEventListener("input", filterAnnouncements);

fetchAnnouncements();
