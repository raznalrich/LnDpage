import { database } from "../../js/Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const announcementContainer = document.getElementById("announcementContainer");
const searchInput = document.getElementById("searchInput");

// Array to hold announcements for search functionality
let announcements = [];

// Function to fetch announcements from Firebase
function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; // Clear existing announcements
        announcements = []; // Reset announcements array

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const announcement = {
                    title: data.title,
                    date: new Date(data.date), // Convert to Date object
                    desc: data.desc,
                };
                announcements.push(announcement); // Add to the array

                // Display the announcement
                displayAnnouncement(announcement);
            });
        } else {
            const message = document.createElement("p");
            message.innerText = "No announcements found.";
            announcementContainer.appendChild(message);
        }
    });
}

// Function to display an announcement
function displayAnnouncement(announcement) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="icon-wrapper">
            <div class="red-circle">
                <div class="white-circle"></div>
            </div>
        </div>
        <h3>${announcement.title}</h3>
        <p>${announcement.date.toLocaleDateString()} - ${announcement.date.toLocaleTimeString()}</p>
        <p>${announcement.desc}</p>
    `;
    announcementContainer.appendChild(card);
}

// Function to filter announcements based on search input
function filterAnnouncements() {
    const query = searchInput.value.toLowerCase(); // Get the search query
    announcementContainer.innerHTML = ""; // Clear the container

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

// Event listener for search input
searchInput.addEventListener("input", filterAnnouncements);

// Fetch announcements on page load
fetchAnnouncements();
