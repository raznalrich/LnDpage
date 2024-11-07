const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let events = []; // Store fetched events
const monthDisplay = document.getElementById("monthDisplay");
const eventContainer = document.getElementById("eventContainer");
const searchInput = document.getElementById("searchInput");

// Fetch events from Firebase
async function fetchEvents() {
    try {
        const response = await fetch(databaseURL);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        events = Object.values(data); // Store events in global array
        displayFilteredEvents(); // Display events on initial load
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Function to calculate duration in hours excluding Sundays
function calculateDuration(startDate, endDate, startTime, endTime) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Parse the start and end times
    const startTimeParts = startTime.split(':').map(Number);
    const endTimeParts = endTime.split(':').map(Number);
    
    // Calculate daily duration in hours
    const dailyDuration = (endTimeParts[0] - startTimeParts[0]) + (endTimeParts[1] - startTimeParts[1]) / 60; // Duration in hours
    
    let totalDuration = 0;

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0) { // 0 represents Sunday
            totalDuration += dailyDuration; // Add daily duration for each day excluding Sundays
        }
    }

    return totalDuration; // Total hours
}

// Display events based on month and search query
function displayFilteredEvents() {
    const query = searchInput.value.toLowerCase().trim();
    eventContainer.innerHTML = ""; // Clear existing events

    const filteredEvents = events.filter(event => {
        const isMonthMatch = new Date(event.startDate).getMonth() === currentMonth;
        const isSearchMatch = !query || 
                              event.courseName.toLowerCase().includes(query) || 
                              event.trainerName.toLowerCase().includes(query) || 
                              event.targetAudience.toLowerCase().includes(query);
        return isMonthMatch && isSearchMatch;
    });
    
    filteredEvents.forEach(event => {
        const duration = calculateDuration(event.startDate, event.endDate, event.startTime, event.endTime); // Calculate duration
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-content">
                <h2><span class="red">${new Date(event.startDate).getDate()}</span> ${event.courseName}</h2>
                <p>Key Points: ${event.keyPoints || "N/A"}</p>
                <div class="details">
                    <p>Target Audience: <span>${event.targetAudience}</span></p>
                    <p>Start Date: <span>${event.startDate}</span></p>
                    <p>End Date: <span>${event.endDate}</span></p>
                    <p>Time: <span>${event.startTime || "N/A"} - ${event.endTime || "N/A"}</span></p> <!-- New Time row -->
                    <p>Trainer: <span>${event.trainerName}</span></p>
                    <p>Mode: <span>${event.mode}</span></p>
                    <p>Time Duration: <span>${duration.toFixed(2)} hours</span></p> <!-- Updated Time Duration field -->
                </div>
            </div>
            <i class="fa-solid fa-laptop"></i>
        `;
        eventContainer.appendChild(card);
    });
}

// Update month display
function updateMonthDisplay() {
    monthDisplay.textContent = monthNames[currentMonth];
    displayFilteredEvents();
}

// Event listeners for month navigation
document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth = (currentMonth - 1 + 12) % 12; // Loop back if at January
    updateMonthDisplay();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth = (currentMonth + 1) % 12; // Loop back if at December
    updateMonthDisplay();
});

// Event listener for search input
searchInput.addEventListener("input", displayFilteredEvents);

// Initial load
fetchEvents();
