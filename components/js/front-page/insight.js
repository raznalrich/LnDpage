import { database, child, get, ref } from "../Firebase.js";

function getInsight() {
  let swiperContainer = document.querySelector(".mySwiper");

  const dref = ref(database);

  get(child(dref, "leaderfiles")).then((announce) => {
    announce.forEach((leaderfiles) => {
      let leaderName = leaderfiles.child("fileCat").val();
      let insightDescription = leaderfiles.child("fileDesc").val();
      let leaderImage = leaderfiles.child("fileURL").val();
      let leaderTitle = leaderfiles.child("fileTitle").val();

      
      let slide = document.createElement("swiper-slide");
      slide.innerHTML = `
        <div class="content">
          <div class="profile">
            <div class="leaderImg"><img src="${leaderImage}" alt="${leaderName}" /></div>
            <div class="info">
              <p class="name">${leaderName}</p>
              <p class="title">${leaderTitle}</p>
            </div>
          </div>
          <div class="divider"></div>
          <div class="quote">
            <p>${insightDescription}</p>
          </div>
        </div>
      `;
      swiperContainer.appendChild(slide);
    });
  });
}

getInsight();
