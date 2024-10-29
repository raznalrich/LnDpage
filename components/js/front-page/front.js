// let slideIndex = 0;
// let cycleCount = 0; 
// const maxCycles = 3;

import { storage, database } from "../calenderAPI.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// // Call showSlides once the DOM is fully loaded
// window.onload = function() {
//     showSlides();
// };

// function showSlides() {
//     const slides = document.querySelectorAll(".carousel-slide");
//     const dots = document.querySelectorAll(".dot");

//     // Hide all slides
//     slides.forEach((slide) => {
//         slide.style.display = "none";
//     });

//     // Move to the next slide
//     slideIndex++;
//     if (slideIndex > slides.length) {
//         slideIndex = 1; 
//         cycleCount++;
//     }

//     // Show the current slide
//     slides[slideIndex - 1].style.display = "block"; 

//     // Activate the corresponding dot
//     dots.forEach(dot => dot.classList.remove("active"));
//     dots[slideIndex - 1].classList.add("active"); 

//     if (cycleCount < maxCycles) {
//         setTimeout(showSlides, 3000); 
//     }
// }

// window.moveSlide = function(n) {
//     slideIndex += n;
//     const totalSlides = document.querySelectorAll(".carousel-slide").length;
//     if (slideIndex < 1) {
//         slideIndex = totalSlides;
//     }
//     if (slideIndex > totalSlides) {
//         slideIndex = 1;
//     }
//     showSlides();
// };



// window.currentSlide = function(n) {
//     slideIndex = n;
//     showSlides();
// };
// Carousel Swiper instance with auto-scrolling and unique selectors



// Initialize the main carousel Swiper (in .carousel-swiper)
const carouselSwiper = new Swiper('.carousel-swiper .swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.carousel-swiper .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.carousel-swiper .swiper-button-next',
        prevEl: '.carousel-swiper .swiper-button-prev',
    },
});

// Fetch images and add to main carousel
function fetchCarouselImages() {
    const swiperWrapper = document.getElementById('swiper-wrapper');

    // Reference to Firebase database
    const filesRef = ref(database, 'bannerfiles');

    get(filesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filesData = snapshot.val();
            for (const fileIndex in filesData) {
                if (filesData.hasOwnProperty(fileIndex)) {
                    const fileData = filesData[fileIndex];
                    const isActive = fileData.isActive;
                    const fileURL = fileData.fileURL;
                    const fileCat = fileData.fileCat;
                    const fileDesc = fileData.fileDesc;

                    if (isActive === 1) { // Only include active images
                        const slide = document.createElement('div');
                        slide.classList.add('swiper-slide');
                        slide.innerHTML = `
                            <img src="${fileURL}" alt="${fileCat}">
                            <div class="description-overlay">
                                <h2>${fileCat}</h2>
                                <p>${fileDesc}</p>
                                <button class="know-more-btn">Know More</button>
                            </div>
                        `;
                        swiperWrapper.appendChild(slide);
                    }
                }
            }
            carouselSwiper.update(); // Update Swiper after adding slides
        } else {
            console.log("No active images found.");
        }
    }).catch((error) => {
        console.error("Error retrieving files:", error);
    });
}

// Call the function to fetch images
fetchCarouselImages();





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
                card.innerHTML = `
        
        <div class="calendarEventContainer">
                    <div class="date">
                        <p>${month}</p>
                        <h2>${day}</h2>
                        <p style="margin-top: 10px;font-size: 15px;">${year}</p>
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
