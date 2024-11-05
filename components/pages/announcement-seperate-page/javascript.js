import { database } from "../../js/Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const announcementContainer = document.getElementById("announcementContainer");
const showAllButton = document.getElementById("showAllButton");
const searchInput = document.getElementById("homeSearchInput");

let announcements = []; // Store all announcements for easy filtering

// Helper function to get today's date at midnight
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    return today;
}

// Function to get query parameter value by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch all announcements from today onwards, sorted by date
function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; 
        announcements = []; // Reset the announcements array
        const today = getTodayDate();

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const announcementDate = new Date(data.date);

                // Only include announcements from today onwards
                if (announcementDate >= today) {
                    announcements.push({
                        title: data.title,
                        date: announcementDate,
                        desc: data.desc,
                    });
                }
            });

            // Sort announcements by date
            announcements.sort((a, b) => a.date - b.date);

            // Display each announcement
            displayAnnouncements(announcements);
        } else {
            announcementContainer.innerHTML = "<p>No announcements found.</p>";
        }
    });
}

// Function to display all announcements in the provided list
function displayAnnouncements(announcementList) {
    announcementContainer.innerHTML = ""; // Clear current announcements
    announcementList.forEach(displayAnnouncement); // Display each announcement in the list
}

// Function to display a single announcement card
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

// Display a specific announcement by title, only if it is from today or later
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

                // Check if the announcement title matches and is from today onwards
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

        // Show the "Show All" button if a matching announcement is found
        if (found) {
            showAllButton.style.display = "block";
        } else {
            announcementContainer.innerHTML = "<p>Announcement not found.</p>";
        }
    });
}

// Filter announcements based on the search input, searching only in the title
function filterAnnouncements() {
    const query = searchInput.value.toLowerCase();
    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(query)
    );
    displayAnnouncements(filteredAnnouncements); // Display the filtered results
}

// Listen for input changes on the search bar
searchInput.addEventListener("input", filterAnnouncements);

// Check for "title" query parameter and display specific announcement or all announcements
const title = getQueryParam("title");
if (title) {
    displaySelectedAnnouncementByTitle(decodeURIComponent(title)); // Show the specific announcement
} else {
    fetchAnnouncements(); // Load all announcements by default if no query parameter is set
}

// Event listener for "Show All" button to display all announcements
showAllButton.addEventListener("click", () => {
    announcementContainer.innerHTML = ""; // Clear specific announcement view
    showAllButton.style.display = "none"; // Hide the "Show All" button
    fetchAnnouncements(); // Load and display all announcements
});
