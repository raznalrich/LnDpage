let slideIndex = 0;
let cycleCount = 0; 
const maxCycles = 3; 

showSlides();

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

function moveSlide(n) {
    slideIndex += n;
    const totalSlides = document.querySelectorAll(".carousel-slide").length;
    if (slideIndex < 1) {
        slideIndex = totalSlides;
    }
    if (slideIndex > totalSlides) {
        slideIndex = 1;
    }
    showSlides();
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}



//  function rhombusoverlay() {
//     const canvas = document.getElementsByClassName("rhombus");
// const ctx = canvas.getContext("2d");

// // Define a new path
// ctx.beginPath();

// // Set start-point
// ctx.moveTo(20,20);

// // Set sub-points
// ctx.lineTo(100,20);
// ctx.lineTo(175,100);
// ctx.lineTo(20,100);

// // Set end-point
// ctx.lineTo(20,20);

// // Draw it
// ctx.stroke();
// };

// window.onload = function(){
//     rhombusoverlay();
// }
