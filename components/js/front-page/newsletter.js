import { storage, database } from "../Firebase.js";
import {
  child,
  get,
  getDatabase,
  set,
  ref,
  ref as dbRef 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


// const dref = ref(getDatabase(), "newsletter");
// get(dref)
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       const data = snapshot.val();

//       // Create an img element
//       const image = document.createElement("img");
//       image.src = data[1].htmlurl;
//       image.style.width = "100%"; // Ensures responsive full width

//       // Append the image to a container div
//       document.getElementById("newsletter-iframe").innerHTML = ""; // Clear previous content if needed
//       document.getElementById("newsletter-iframe").appendChild(image);

//       // Set button text
//       document.getElementById("newsletter-button").innerHTML = data[1].date;
//     } else {
//       console.log("No data available");
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching data: ", error);
//   });

//   function shownewsletter() {
//   const dref = ref(database);
//   let div = document.getElementById("newsletter-iframe");

//   get(child(dref, "newsletter")).then((snapshot) => {
//     if (snapshot.exists()) {
//       snapshot.forEach((menu) => {
//         let value = menu.val();

//         let iframe = document.createElement("img");
//         iframe.src = value.htmlurl;
//         iframe.style.width = "100%"; 
//         console.log(iframe);
//         console.log(div);

//         div.appendChild(iframe);
//       });
//     } else {
//       let p = document.createElement("p");
//       p.innerHTML = "No files founded";
//       div.appendChild(p);
//     }
//   });
// }

// shownewsletter();
const eventContainer = document.getElementById("eventContainer");

// === Fetch & Preview Calendar Image ===
window.getCalendarImage = async function () {
    const calendarImageRef = dbRef(database, "newsletter");

    try {
        const snapshot = await get(calendarImageRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(data);
            const preview = document.getElementById("calendarImagePreview");
            preview.innerHTML = `<img src="${data[1].htmlurl}" style="width:1000px;height:auto;" />`;
            
            
        } else {
            console.log("No calendar image found in DB");
        }
    } catch (error) {
        console.error("Error fetching calendar image:", error);
    }
};


function getSidebarAnnouncements(){
  const sidebar = document.querySelector("#pageSideBar .announcement-list");
  const dref = ref(database);

  get(child(dref,"announcement")).then((announce) => {
        let announcementsArray = [];
        announce.forEach(announcement => {
            let announcementDate = announcement.child("date").val();
            let announcementDesc = announcement.child("desc").val();
            let announcementTitle = announcement.child("title").val();
            let announcementUrl = announcement.child("url").val();

           announcementsArray.push({
        date: new Date(announcementDate),
        title: announcementTitle,
        desc: announcementDesc,
        url: announcementUrl,
      }); 
        });
        announcementsArray.sort((a, b) => b.date - a.date);

    // Limit to 3
    const limited = announcementsArray.slice(0, 3);

    // Clear existing
    sidebar.innerHTML = "";

    limited.forEach((a) => {
      const li = document.createElement("li");

      // If URL exists → wrap title in <a>
      const title = a.url
        ? `<a href="${a.url}" target="_blank"><h3>${a.title}</h3></a>`
        : `<h3>${a.title}</h3>`;

      li.innerHTML = `
        ${title}
        <p>${a.desc}</p>
      `;

      sidebar.appendChild(li);
    });
  })
}

//image
function getPhotoGallery(){
  const sidebarpic = document.querySelector("#gallery-preview-list .photo-list");
  const dref = ref(database);

  get(child(dref,"files")).then((announce) => {
        let announcementsArray = [];
        announce.forEach(announcement => {
            let fileCategory = announcement.child("fileCat").val();
            let fileDesc = announcement.child("fileDesc").val();
            let fileName = announcement.child("fileName").val();
            let fileURL = announcement.child("fileURL").val();

           announcementsArray.push({
        category: fileCategory,
        title: fileName,
        desc: fileDesc,
        url: fileURL,
      }); 
        });
        console.log(announcementsArray);
        
        announcementsArray.sort((a, b) => b.date - a.date);

    // Limit to 3
    const limited = announcementsArray.slice(0, 3);
            console.log(limited);


    // Clear existing
    sidebarpic.innerHTML = "";

    limited.forEach((a) => {
      const li = document.createElement("li");

        li.innerHTML = `
    <div class="gallery-item">
      <img src="${a.url}" alt="${a.title}" />
      <p>${a.desc}</p>
    </div>
  `;

      sidebarpic.appendChild(li);
    });
  })
}
// Run on page load
getCalendarImage();
getPhotoGallery();

getSidebarAnnouncements();

