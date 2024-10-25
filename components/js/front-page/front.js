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

    // Continue cycling if max cycles not reached
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
  
                const card = document.createElement('div');
                card.classList.add('swiper-slide');
                card.innerHTML = `
        
        <div class="calendarEventContainer">
                    <div class="date">
                        <p>Oct</p>
                        <h2>26</h2>
                        <p style="margin-top: 10px;font-size: 15px;">2024</p>
                    </div>
                    <img src="./components/assets/imga.png" alt="" srcset="">
                    <div class="coursename">
                        <p><strong>${courseName}</strong></p>
                    </div>
                </div>
      `;
  
  
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
