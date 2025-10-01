import { database } from "../Firebase.js";
import { child, get, getDatabase, set, update, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Fetch and render calendar events from Firebase
document.addEventListener('DOMContentLoaded', () => {
  showCalendarEvents(); // Call this function when the DOM is fully loaded
});

// Function to fetch calendar events from Firebase
function showCalendarEvents() {
  const filesRef = dbRef(getDatabase(), "insights");    
  let swiperCalendar = document.getElementById('swiperCalendar');
  get(filesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const insightsData = snapshot.val();
                renderCalendarEvents(insightsData);
            }
        }
    )

  fetch(databaseURL)
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const events = Object.values(data);
          console.log("Events loaded: ", events.length); // Debug log to check number of events
        //   renderCalendarEvents(events); // Render events if available
      })
      .catch(error => {
          console.error("There was a problem with the fetch operation:", error);
      });
}

// Function to render the calendar events in the Swiper
function renderCalendarEvents(events) {
  const swiperCalendar = document.getElementById('swiperCalendar');
  swiperCalendar.innerHTML = ''; // Clear any existing content

  if (events.length === 0) {
      const noEventsMessage = document.createElement('p');
      noEventsMessage.textContent = 'No events found';
      swiperCalendar.appendChild(noEventsMessage);
      return; // Stop execution if no events
  }

  events.forEach(menu => {
      const {
          courseName,
          startDate,
          startTime,
          endDate,
          endTime,
          keyPoints,
          maxParticipation,
          targetAudience,
          trainerName,
          mode
      } = menu;

      const dateObj = new Date(startDate);
      const day = dateObj.getDate(); 
      const month = dateObj.toLocaleString('default', { month: 'short' });
      const year = dateObj.getFullYear();

      const card = document.createElement('div');
      card.classList.add('swiper-slide');

      // Populate the card with event details (customize as needed)
      card.innerHTML = `
          <div class="calendarEventContainer">
              <div class="calendercontainer">
                  <div class="date">
                      <p>${new Date(menu.startDate).toLocaleString('default', { month: 'short' })}</p>
                      <h2>${new Date(menu.startDate).getDate()}</h2>
                      <p style="margin-top: 10px;font-size: 15px;">${new Date(menu.startDate).getFullYear()}</p>
                  </div>
                  <div class="courseDetails">
                      <div class="coursename">
                          <p><strong>${menu.courseName}</strong></p>
                      </div>
                      <div class="descCal">
                          <div class="trainer">
                              <img src="./components/assets/user-solid.svg" alt="Trainer Icon">
                              <p>${menu.trainerName}</p>
                          </div>
                          <div class="mode">
                             <div class="circle ${menu.mode === 'offline' ? 'black' : menu.mode === 'blended' ? 'yellow' : ''}"></div>

                              <p>${menu.mode}</p>
                          </div>
                      </div>
                      <div class="calbottom"></div>
                  </div>
              </div>
          </div>
      `;

      swiperCalendar.appendChild(card); // Append the card to the swiper
  });

  // Initialize or update Swiper after all slides are added
  initializeCalendarSwiper(events.length);
  
  // Force update after all slides are appended
  setTimeout(() => {
      if (window.calendarSwiper) {
          window.calendarSwiper.update();
      }
  }, 100); // Adjust this delay if necessary
}

// Function to initialize the Swiper
function initializeCalendarSwiper(eventCount) {
  window.calendarSwiper = new Swiper('.mySwiper', {
      slidesPerView: 3,
      spaceBetween: 10,
      loop: eventCount > 1, // Enable loop if more than one event
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });
}

// Update Swiper on window resize
window.addEventListener('resize', () => {
  if (window.calendarSwiper) {
      window.calendarSwiper.update();
  }
});
