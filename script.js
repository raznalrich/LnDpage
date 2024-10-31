import { storage, database, app } from "./components/js/Firebase.js";
import { child, get, getDatabase,query, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


// document.addEventListener("DOMContentLoaded", function () {
//     const section = document.getElementById("carousel");

//     // Fetch the HTML content
//     fetch("./components/pages/user/topBanner.html")
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.text();
//         })
//         .then(data => {
//             // Insert the HTML content into the section
//             section.innerHTML = data;
//         })
//         .catch(error => {
//             console.error("There was a problem with the fetch operation:", error);
//         });
// });

window.updateAnouncement=function(){
    let update=document.getElementById('badge');
    const date = new Date();
    const month = date.getMonth() + 1;
    
    if(month<10){
        month='0'+month;
        console.log(month);
    }
    console.log(typeof(month));
    const db = database;
    const indexRef = dbRef(db, 'announcement');
    let notificationCount=0;
    get(indexRef).then((result) => {
        if(result.exists()){

            let fileData=result.val();

            for(const fileIndex in fileData){
                console.log('got file',fileData);

                const fileList=fileData[fileIndex];
                let date=fileList.date;
                let sub=date.substring(5,7);
                console.log(sub);
                if(sub==month){
                    notificationCount++;
                }else{
                    console.log('not matching')
                }
                
            }
            update.textContent=notificationCount;
        }
    }).catch((err) => {
        
    });
}
document.addEventListener("DOMContentLoaded",updateAnouncement())

// //announcement notification hover effect
let hideTimeout;
let announcementContainer = document.getElementById('announcement-hover');

window.displayNotification = function() {
    console.log('reached mouseover');
    clearTimeout(hideTimeout);
    announcementContainer.style.display = 'block'; 
};

window.removeNotification = function() {
    hideTimeout = setTimeout(() => {
        announcementContainer.style.display = 'none'; 
    }, 300); 
};

window.stayNotificationOn = function() {
    clearTimeout(hideTimeout); 
    announcementContainer.style.display = 'block';
};

window.removeStayedNotification = function() {
    hideTimeout = setTimeout(() => {
        announcementContainer.style.display = 'none'; 
    }, 300); 
};

let announcementButton = document.getElementById('announcement');
announcementButton.addEventListener('mouseenter', displayNotification);
announcementButton.addEventListener('mouseleave', removeNotification);

announcementContainer.addEventListener('mouseenter', stayNotificationOn);
announcementContainer.addEventListener('mouseleave', removeStayedNotification);

 window.addNotifications=function(){
    const db = database;
    const indexRef = dbRef(db, 'announcement');
    let counter=0;
    get(indexRef).then((snapshot)=>{
        if(snapshot.exists()){
            let size=snapshot.size;
            console.log(size);
            const startAt=size>5?size-5:0;
            console.log(startAt);
            let fileData=snapshot.val();
            fileData.forEach((a)=>{
                counter++;
                if(counter>=startAt){
                    console.log('success');
                    announcementContainer.innerHTML+=`
                    <div class='anouncement-section'>
                        <div class='notification-icon'>
                        <img src="components/assets/bell-solid (1) 2.svg" alt="NOT FOUND">
                        </div>
                        <div class='notification-description'>
                        <h4>${a.title}</h4>
                        </div>
                    </div>
                    `
                }
            })

        }
    }).catch((err)=>{
        console.log(err);
    })
}
document.addEventListener("DOMContentLoaded",addNotifications())


const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";

fetch(databaseURL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Logs the data from the Firebase database
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
  });
