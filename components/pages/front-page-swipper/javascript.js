import { database } from "../../js/admin/Firebase.js"; 
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs"; 

function fetchCarouselImages() {
    const swiperWrapper = document.getElementById('swiper-wrapper');
    const filesRef = ref(database, 'bannerfiles');
    
    get(child(filesRef, '/')).then((snapshot) => {
        if (snapshot.exists()) {
            const filesData = snapshot.val();
            const activeSlides = [];

            for (const fileIndex in filesData) {
                if (filesData.hasOwnProperty(fileIndex)) {
                    const fileData = filesData[fileIndex];
                    const isActive = fileData.isActive;
                    const fileURL = fileData.fileURL;
                    const fileCat = fileData.fileCat;
                    const fileDesc = fileData.fileDesc;

                    if (isActive === 1) {
                        const slide = document.createElement('div');
                        slide.classList.add('swiper-slide');
                        slide.innerHTML = `
                            <!-- Default image overlay -->
                            <div class="default-image">
                                <img src="../../images/temp/Image (1).png" alt="Default Image">
                            </div>
                            <!-- Dynamic image from Firebase -->
                            <img src="${fileURL}" alt="${fileCat}" class="slide-image">
                            <!-- Description Overlay -->
                            <div class="description-overlay">
                                <h2>${fileCat}</h2>
                                <p>${fileDesc}</p>
                                <button class="know-more-btn">Know More</button>

                            </div>
                        `;
                        activeSlides.push(slide);
                    }
                }
            }

            activeSlides.forEach(slide => swiperWrapper.appendChild(slide));

            if (activeSlides.length > 0) {
                initializeSwiper(activeSlides.length > 1);
            } else {
                console.log("No active images found.");
            }
        } else {
            console.log("No data available in bannerfiles.");
        }
    }).catch((error) => {
        console.error("Error retrieving files:", error);
    });
}

function initializeSwiper(loopEnabled) {
    new Swiper('.carousel-swiper .swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: loopEnabled,
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
}

fetchCarouselImages();
