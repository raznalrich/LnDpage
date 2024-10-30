let slideIndex = 0;
let cycleCount = 0; 
const maxCycles = 3;

import { storage, database } from "../calenderAPI.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// Call showSlides once the DOM is fully loaded
window.onload = function() {
    showSlides();
};

function showSlides() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");

    // Hide all slides
    slides.forEach((slide) => {
        slide.style.display = "none";
    });

    // Move to the next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; 
        cycleCount++;
    }

    // Show the current slide
    slides[slideIndex - 1].style.display = "block"; 

    // Activate the corresponding dot
    dots.forEach(dot => dot.classList.remove("active"));
    dots[slideIndex - 1].classList.add("active"); 

    if (cycleCount < maxCycles) {
        setTimeout(showSlides, 3000); 
    }
}

window.moveSlide = function(n) {
    slideIndex += n;
    const totalSlides = document.querySelectorAll(".carousel-slide").length;
    if (slideIndex < 1) {
        slideIndex = totalSlides;
    }
    if (slideIndex > totalSlides) {
        slideIndex = 1;
    }
    showSlides();
};



window.currentSlide = function(n) {
    slideIndex = n;
    showSlides();
};



function showCalendarEvents(){
    const dref = ref(database);
    let div = document.getElementById('swiperCalendar');
  
    get(child(dref,'courses')).then((snapshot)=>{
        if(snapshot.exists()){
            snapshot.forEach((menu)=>{
                let value = menu.val();
                console.log(value);
                
                const courseName = value.courseName;
                const startDate = value.startDate;
                const startTime = value.startTime;
                const endDate = value.endDate;
                const endTime = value.endTime;
                const keyPoints = value.keyPoints;
                const maxParticipation = value.maxParticipation;
                const targetAudience = value.targetAudience;
                const trainerName = value.trainerName;
                const mode = value.mode;
                console.log(startDate);
                
                const dateObj = new Date(startDate);
                const day = dateObj.getDate(); // Extract day (1-31)
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const card = document.createElement('div');
                const year = dateObj.getFullYear();
                card.classList.add('swiper-slide');
                if (mode != 'offline') {
                    card.innerHTML = `
        
      <div class="calendarEventContainer">
                        <div class="calendercontainer">
                        <div class="date">
                            <p>${month}</p>
                        <h2>${day}</h2>
                        <p style="margin-top: 10px;font-size: 15px;">${year}</p>
                    </div>
                    <!-- <img src="./components/assets/calbg.jpg" alt="" srcset="" > -->
                    <div class="courseDetails">

                    
                    <div class="coursename">
                        <p><strong>${courseName}</strong></p>
                    </div>
                    <div class="descCal">
                        <div class="trainer">
                            <img src="./components/assets/user-solid.svg" alt="" srcset="">
                            <p>${trainerName}</p>
                        </div>
                        <div class="mode">
                            <div class="circle"></div>
                            <p>${mode}</p>
                        </div>
                       
                    </div>
                    <div class="calbottom">
                            
                    </div>
                </div>
      `;
                } else {
                    card.innerHTML = `
        
                    <div class="calendarEventContainer">
                                      <div class="calendercontainer">
                                      <div class="date">
                                          <p>${month}</p>
                                      <h2>${day}</h2>
                                      <p style="margin-top: 10px;font-size: 15px;">${year}</p>
                                  </div>
                                  <!-- <img src="./components/assets/calbg.jpg" alt="" srcset="" > -->
                                  <div class="courseDetails">
              
                                  
                                  <div class="coursename">
                                      <p><strong>${courseName}</strong></p>
                                  </div>
                                  <div class="descCal">
                                      <div class="trainer">
                                          <img src="./components/assets/user-solid.svg" alt="" srcset="">
                                          <p>${trainerName}</p>
                                      </div>
                                      <div class="mode">
                                          <div class="circle black"></div>
                                          <p>${mode}</p>
                                      </div>
                                     
                                  </div>
                                  <div class="calbottom">
                                          
                                  </div>
                              </div>
                    `;
                }
                
  
  
      div.appendChild(card);
                
                
            })
        }
        else{
            let p = document.createElement('p');
            p.innerHTML = 'No files founded';
            div.appendChild(p);
        }
    })
  
  }
  
  showCalendarEvents();
