
function showCalendarEvents() {
  const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";
  let swiperCalendar = document.getElementById('swiperCalendar');
  
  fetch(databaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        const events = Object.values(data);
        
        // Render events and wait for all slides to be appended
        renderCalendarEvents(events);
      } else {
        const p = document.createElement('p');
        p.innerHTML = 'No files found';
        swiperCalendar.appendChild(p);
      }
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function renderCalendarEvents(events) {
  const swiperCalendar = document.getElementById('swiperCalendar');
  swiperCalendar.innerHTML = ''; // Clear any existing content

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
      const day = dateObj.getDate(); // Extract day (1-31)
      const month = dateObj.toLocaleString('default', { month: 'short' });
      const year = dateObj.getFullYear();

      const card = document.createElement('div');
      card.classList.add('swiper-slide');

      card.innerHTML = `
          <div class="calendarEventContainer">
              <div class="calendercontainer">
                  <div class="date">
                      <p>${month}</p>
                      <h2>${day}</h2>
                      <p style="margin-top: 10px;font-size: 15px;">${year}</p>
                  </div>
                  <div class="courseDetails">
                      <div class="coursename">
                          <p><strong>${courseName}</strong></p>
                      </div>
                      <div class="descCal">
                          <div class="trainer">
                              <img src="./components/assets/user-solid.svg" alt="Trainer Icon">
                              <p>${trainerName}</p>
                          </div>
                          <div class="mode">
                              <div class="circle ${mode === 'offline' ? 'black' : ''}"></div>
                              <p>${mode}</p>
                          </div>
                      </div>
                      <div class="calbottom"></div>
                  </div>
              </div>
          </div>
      `;

      swiperCalendar.appendChild(card);
  });

  // Initialize or update Swiper after all events are added
  initializeCalendarSwiper(events.length);

  // Ensure Swiper updates when visibility changes
  observeSwiperVisibility();
}

function initializeCalendarSwiper(eventCount) {
  const loopMode = eventCount > 1;

  // Initialize or update Swiper instance with loop based on event count
  window.calendarSwiper = new Swiper('.myCalendarSwiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: loopMode,
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });

  // Force Swiper to re-render after a slight delay
  setTimeout(() => {
      window.calendarSwiper.update();
  }, 100);
}

// Use ResizeObserver to detect visibility or size changes
function observeSwiperVisibility() {
  const swiperCalendar = document.getElementById('swiperCalendar');
  const resizeObserver = new ResizeObserver(() => {
    if (swiperCalendar.offsetWidth > 0 && swiperCalendar.offsetHeight > 0) {
      setTimeout(() => {
        window.calendarSwiper.update();
      }, 100);
    }
  });

  resizeObserver.observe(swiperCalendar);
}


showCalendarEvents();
