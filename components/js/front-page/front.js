let slideIndex = 0;
let cycleCount = 0; 
const maxCycles = 3; 

const descriptions = [
    "Editable description for Slide 1", 
    "Editable description for Slide 2", 
    "Editable description for Slide 3", 
    "Editable description for Slide 4"
];

showSlides();

function showSlides() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");

    slides.forEach((slide, index) => {
        slide.style.display = "none";
    });

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; 
        cycleCount++;
    }

    slides[slideIndex - 1].style.display = "block"; 

    dots.forEach(dot => dot.classList.remove("active"));
    dots[slideIndex - 1].classList.add("active"); 

    if (cycleCount < maxCycles) {
        setTimeout(showSlides, 3000); 
    }
}

function moveSlide(n) {
    slideIndex += n;
    if (slideIndex < 1) {
        slideIndex = document.querySelectorAll(".carousel-slide").length;
    }
    showSlides();
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}
