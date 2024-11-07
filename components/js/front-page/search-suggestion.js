// Import the necessary Firebase functions
import { database } from "./../Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const homeSearchInput = document.getElementById("homeSearchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

let announcements = [];

// Fetch announcements data from Firebase
function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcements = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                announcements.push({
                    title: data.title,
                    date: new Date(data.date),
                    desc: data.desc,
                });
            });
        }
    });
}

// Display suggestions based on the search query
function displaySuggestions(query) {
    searchSuggestions.innerHTML = ""; // Clear previous suggestions
    if (!query) return;

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(query.toLowerCase())
    );

    filteredAnnouncements.forEach(announcement => {
        const suggestion = document.createElement("div");
        suggestion.textContent = announcement.title;
        suggestion.addEventListener("click", () => {
            const encodedTitle = encodeURIComponent(announcement.title); // Encode title to be URL-safe
            window.location.href = `./components/pages/announcement-seperate-page/index.html?title=${encodedTitle}`;
        });
        searchSuggestions.appendChild(suggestion);
    });
    
}

// Listen for input changes to show suggestions
homeSearchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    displaySuggestions(query);
});

// Initialize announcements data
fetchAnnouncements();
