window.getAllFiles = function () {
    const filesRef = dbRef(getDatabase(), 'bannerfiles');  
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
              slide.className = 'swiper-slide';
  
              // Add image, heading, and description to each slide
              slide.innerHTML = `
                <img src="${fileURL}" alt="${fileCat}" style="width:100%; height:auto;">
                <h3>${fileCat}</h3>
                <p>${fileDesc}</p>
              `;
  
              // Append slide to the swiper wrapper
              document.getElementById("swiper-wrapper").appendChild(slide);
            }
          }
        }
        
        // Initialize Swiper after adding slides
        initializeSwiper();
      } else {
        console.log("No files found.");
      }
    }).catch((error) => {
      console.error("Error retrieving files:", error);
    });
  }
  
  // Initialize Swiper
  function initializeSwiper() {
    new Swiper('.swiper-container', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  