// window.getAllFiles = function () {
//     const filesRef = dbRef(getDatabase(), 'bannerfiles');  
//     get(filesRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const filesData = snapshot.val();
//         for (const fileIndex in filesData) {
//           if (filesData.hasOwnProperty(fileIndex)) {
//             const fileData = filesData[fileIndex];
//             const isActive = fileData.isActive;
//             const fileURL = fileData.fileURL;
//             const fileCat = fileData.fileCat;
//             const fileDesc = fileData.fileDesc;
  
//             if (isActive === 1) { // Only include active images
//               const slide = document.createElement('div');
//               slide.className = 'swiper-slide';
  
//               // Add image, heading, and description to each slide
//               slide.innerHTML = `
               
//                 <img src="${fileURL}" alt="${fileCat}">
//             <div class="description-overlay">
              
//               <img src="../../../components/images/temp/Image (1).png" alt="" srcset="">
//                 <h2>${fileCat}</h2>
//                 <p>${fileDesc}</p>
//                 <button class="know-more-btn">Know More</button>
                
 
//             </div>
//               `;
  
//               // Append slide to the swiper wrapper
//               document.getElementById("swiper-wrapper").appendChild(slide);
//             }
//           }
//         }
        
//         // Initialize Swiper after adding slides
//         initializeSwiper();
//       } else {
//         console.log("No files found.");
//       }
//     }).catch((error) => {
//       console.error("Error retrieving files:", error);
//     });
//   }

  import { storage, database } from "../Firebase.js";
  import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
  import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
  
  //removed the code of swipper for slideshow from here to front-page-swipper
  
  // function showBannerImages(){
  //     const dref = ref(database);
  //     let div = document.getElementById('swiperslide');
    
  //     get(child(dref,'bannerfiles')).then((snapshot)=>{
  //         if(snapshot.exists()){
  //             snapshot.forEach((menu)=>{
  //                 let value = menu.val();
  //                 console.log(value);
  //                 let imageURL = value.fileURL;
  //                 const isActive = value.isActive;
                    
  //                   const fileCat = value.fileCat;
  //                   const fileDesc = value.fileDesc;
                  
                 
                  
  //               if(isActive ===1){

             
  //                 const card = document.createElement('div');
  //                 card.classList.add('swiper-slide');
  //                     card.innerHTML = `
  //         <img src="${imageURL}" alt="Batch Training Image 1">
  //           <div class="description-overlay">
              
  //             <img src="../../../components/images/temp/Image (1).png" alt="" srcset="">
  //               <h2>${fileCat}</h2>
  //               <p>${fileDesc} </p>
  //               <button class="know-more-btn">Know More</button>
                
 
  //           </div>
  //       `;
                  
    
    
  //       div.appendChild(card);
  //     }
                  
  //       initializeSwiper();   
  //             })
  //         }
  //         else{
  //             let p = document.createElement('p');
  //             p.innerHTML = 'No files founded';
  //             div.appendChild(p);
  //         }
  //     })
    
  //   }
    
  //   showBannerImages();

//   function showBannerImages() {
//     const dref = ref(database);
//     let div = document.getElementById('swiperslide');
    
//     get(child(dref, 'bannerfiles')).then((snapshot) => {
//         if (snapshot.exists()) {
//             const banners = [];

//             // Collect all banners in an array
//             snapshot.forEach((menu) => {
//                 let value = menu.val();
//                 const { fileURL, isActive, fileCat, fileDesc } = value;

//                 if (isActive === 1) {
//                     banners.push({ fileURL, fileCat, fileDesc });
//                 }
//             });

//             // Render banners after all data is collected
//             renderBanners(banners);
//         } else {
//             let p = document.createElement('p');
//             p.innerHTML = 'No files found';
//             div.appendChild(p);
//         }
//     });
// }

// function renderBanners(banners) {
//     let div = document.getElementById('swiperslide');


//     div.innerHTML = '';

//     banners.forEach((banner) => {
//         const { fileURL, fileCat, fileDesc } = banner;

//         const card = document.createElement('div');
//         card.classList.add('swiper-slide');
//         card.innerHTML = `
//             <img src="${fileURL}" alt="Batch Training Image">
//             <div class="description-overlay">
//                 <img src="../../../components/images/temp/Image (1).png" alt="" srcset="">
//                 <h2>${fileCat}</h2>
//                 <p>${fileDesc}</p>
              
//             </div>
//         `;

//         div.appendChild(card);
//         console.log(card);
        
//     });

//     // Initialize Swiper after all images are added
//     // initializeSwiper();
// }

// // Call the function to load and display banners
// showBannerImages();



  
  // Initialize Swiper
  // function initializeSwiper() {
  //   new Swiper('.swiper-container', {
  //     loop: true,
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //     pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true,
  //     },
  //   });
  // }
  




  // sample

  async function showBannerImages() {
    const dref = ref(database);
    const div = document.getElementById('swiperslide');

    const loadingMessage = document.createElement('p');
    loadingMessage.id = 'loadingMessage';
    loadingMessage.innerText = 'Loading...';
    div.appendChild(loadingMessage);

    try {
        const snapshot = await get(child(dref, 'bannerfiles'));
        
        loadingMessage.remove();

        if (snapshot.exists()) {
            const banners = [];

            snapshot.forEach((menu) => {
                let value = menu.val();
                const { fileURL, isActive, fileCat, fileDesc } = value;

                if (isActive === 1) {
                    banners.push({ fileURL, fileCat, fileDesc });
                }
            });

            await renderBanners(banners); // Wait for banners to render before initializing Swiper
        } else {
            const noFilesMessage = document.createElement('p');
            noFilesMessage.innerHTML = 'No files found';
            div.appendChild(noFilesMessage);
        }
    } catch (error) {
        loadingMessage.remove();
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = 'Failed to load images. Please try again later.';
        div.appendChild(errorMessage);
        console.error("Error fetching banner images:", error);
    }
}

async function renderBanners(banners) {
    const div = document.getElementById('swiperslide');
    div.innerHTML = ''; // Clear any existing content

    // Render each banner and wait for images to load
    await Promise.all(banners.map((banner) => {
        return new Promise((resolve) => {
            const { fileURL, fileCat, fileDesc } = banner;

            const card = document.createElement('div');
            card.classList.add('swiper-slide');
            card.innerHTML = `
                <img src="${fileURL}" alt="Batch Training Image" onload="this.style.opacity=1;">
                <div class="description-overlay">
                    <img src="../../../components/images/temp/Image (1).png" alt="">
                    <h2>${fileCat}</h2>
                    <p>${fileDesc}</p>
                </div>
            `;
            div.appendChild(card);
            resolve(); // Resolve each image load
        });
    }));

    // Initialize or update Swiper after all images are loaded
    initializeSwiper(banners.length);
}

function initializeSwiper(slideCount) {
    const loopMode = slideCount > 1;

    // if (window.mySwiper) {
    //     window.mySwiper.destroy(true, true);
    // }

    window.mySwiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
       
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
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
        window.mySwiper.update();
    }, 100); // Adjust delay if necessary
}

// Call the function to load and display banners
showBannerImages();
