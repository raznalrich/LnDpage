

// import { storage, database } from "../calenderAPI.js";
// import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
// import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

//removed the code of swipper for slideshow from here to front-page-swipper


  

// function showCalendarEvents(){
//     const dref = ref(database);
//     let div = document.getElementById('swiperCalendar');
  
//     get(child(dref,'courses')).then((snapshot)=>{
//         if(snapshot.exists()){
//             snapshot.forEach((menu)=>{
//                 let value = menu.val();
//                 console.log(value);
                
//                 const courseName = value.courseName;
//                 const startDate = value.startDate;
//                 const startTime = value.startTime;
//                 const endDate = value.endDate;
//                 const endTime = value.endTime;
//                 const keyPoints = value.keyPoints;
//                 const maxParticipation = value.maxParticipation;
//                 const targetAudience = value.targetAudience;
//                 const trainerName = value.trainerName;
//                 const mode = value.mode;
//                 console.log(startDate);
                
//                 const dateObj = new Date(startDate);
//                 const day = dateObj.getDate(); // Extract day (1-31)
//                 const month = dateObj.toLocaleString('default', { month: 'short' });
//                 const card = document.createElement('div');
//                 const year = dateObj.getFullYear();
//                 card.classList.add('swiper-slide');
//                 if (mode != 'offline') {
//                     card.innerHTML = `
        
//       <div class="calendarEventContainer">
//                         <div class="calendercontainer">
//                         <div class="date">
//                             <p>${month}</p>
//                         <h2>${day}</h2>
//                         <p style="margin-top: 10px;font-size: 15px;">${year}</p>
//                     </div>
//                     <!-- <img src="./components/assets/calbg.jpg" alt="" srcset="" > -->
//                     <div class="courseDetails">

                    
//                     <div class="coursename">
//                         <p><strong>${courseName}</strong></p>
//                     </div>
//                     <div class="descCal">
//                         <div class="trainer">
//                             <img src="./components/assets/user-solid.svg" alt="" srcset="">
//                             <p>${trainerName}</p>
//                         </div>
//                         <div class="mode">
//                             <div class="circle"></div>
//                             <p>${mode}</p>
//                         </div>
                       
//                     </div>
//                     <div class="calbottom">
                            
//                     </div>
//                 </div>
//       `;
//                 } else {
//                     card.innerHTML = `
        
//                     <div class="calendarEventContainer">
//                                       <div class="calendercontainer">
//                                       <div class="date">
//                                           <p>${month}</p>
//                                       <h2>${day}</h2>
//                                       <p style="margin-top: 10px;font-size: 15px;">${year}</p>
//                                   </div>
//                                   <!-- <img src="./components/assets/calbg.jpg" alt="" srcset="" > -->
//                                   <div class="courseDetails">
              
                                  
//                                   <div class="coursename">
//                                       <p><strong>${courseName}</strong></p>
//                                   </div>
//                                   <div class="descCal">
//                                       <div class="trainer">
//                                           <img src="./components/assets/user-solid.svg" alt="" srcset="">
//                                           <p>${trainerName}</p>
//                                       </div>
//                                       <div class="mode">
//                                           <div class="circle black"></div>
//                                           <p>${mode}</p>
//                                       </div>
                                     
//                                   </div>
//                                   <div class="calbottom">
                                          
//                                   </div>
//                               </div>
//                     `;
//                 }
                
  
  
//       div.appendChild(card);
                
                
//             })
//         }
//         else{
//             let p = document.createElement('p');
//             p.innerHTML = 'No files founded';
//             div.appendChild(p);
//         }
//     })
  
//   }
  
//   showCalendarEvents();


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
}

function initializeCalendarSwiper(eventCount) {
  const loopMode = eventCount > 1;

  // if (window.calendarSwiper) {
  //     window.calendarSwiper.destroy(true, true); // Properly destroy any existing instance
  // }

  // Initialize a new Swiper instance with loop based on event count
  window.calendarSwiper = new Swiper('.myCalendarSwiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });

  // Force Swiper to re-render
  setTimeout(() => {
      window.calendarSwiper.update();
  }, 100); // Adjust delay if necessary
}

// Call the function to load and display calendar events
showCalendarEvents();

  