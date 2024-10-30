import { database } from "../../js/Firebase.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const announcementContainer = document.getElementById("announcementContainer");

// Function to fetch announcements from Firebase
function fetchAnnouncements() {
    const announcementsRef = ref(database, "announcement");

    onValue(announcementsRef, (snapshot) => {
        announcementContainer.innerHTML = ""; // Clear existing announcements

        if (snapshot.exists()) {
            const announcements = [];

            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                announcements.push({
                    title: data.title,
                    date: new Date(data.date), // Convert to Date object
                    desc: data.desc,
                });
            });

            // Sort announcements by date (latest first)
            announcements.sort((a, b) => b.date - a.date);

            // Display announcements
            announcements.forEach((announcement) => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <h3>${announcement.title}</h3>
                    <p>${announcement.date.toLocaleDateString()} - ${announcement.date.toLocaleTimeString()}</p>
                    <p>${announcement.desc}</p>
                `;
                announcementContainer.appendChild(card);
            });
        } else {
            const message = document.createElement("p");
            message.innerText = "No announcements found.";
            announcementContainer.appendChild(message);
        }
    });
}

// Fetch announcements on page load
fetchAnnouncements();
