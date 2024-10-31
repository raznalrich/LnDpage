import { storage, database, app } from "../LnDpage/components/js/Firebase.js";
import { child, get, getDatabase,query, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";

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

 //announcement notification hover effect
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

let announcementButton = document.getElementById('announcement');
announcementButton.addEventListener('mouseenter', displayNotification);
announcementButton.addEventListener('mouseleave', removeNotification);

announcementContainer.addEventListener('mouseenter', displayNotification);
announcementContainer.addEventListener('mouseleave', removeNotification);

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


//event notification
let eventTimeout;
let eventContainer = document.getElementById('event-hover');

window.displayEvent = function() {
    console.log('reached mouseover');
    clearTimeout(eventTimeout);
    eventContainer.style.display = 'block';
};

window.removeEvent = function() {
    eventTimeout = setTimeout(() => {
        eventContainer.style.display = 'none';
    }, 300);
};
eventContainer.addEventListener('mouseenter', displayEvent);
eventContainer.addEventListener('mouseleave', removeEvent);
let eventButton = document.getElementById('event');
eventButton.addEventListener('mouseenter', displayEvent);
eventButton.addEventListener('mouseleave', removeEvent);

let events = [];
window.addEvents= async function(){
    await fetch(databaseURL)
    .then(response => response.json())
    .then(data => {
        Object.keys(data).forEach(key => {
            events.push({ title: data[key].courseName, start: data[key].startDate})
        });
        events.sort((a, b) => new Date(a.start) - new Date(b.start));
        const today = new Date();
        const upcomingEvents = events.filter(event => new Date(event.start) > today);
        const recentFiveEvents = upcomingEvents.slice(0, 5);
        console.log('this is event',recentFiveEvents);
        recentFiveEvents.forEach(topevent=>{

            eventContainer.innerHTML+=`
            <div class='event-section'>
                <div class='event-icon'>
                <img src="components/assets/calendar-regular (1) 2.svg" alt="NOT FOUND">
                </div>
                <div class='notification-description'>
                <h4>${topevent.title}</h4>
                </div>
            </div>
            `
        })
       
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

        }
    

document.addEventListener("DOMContentLoaded",addEvents())

await fetch(databaseURL)
.then(response => response.json())
.then(data => {
    Object.keys(data).forEach(key => {
        events.push({ title: data[key].courseName, start: data[key].startDate})
    });

    console.log(events)
})
.catch(error => {
    console.error("Error fetching data:", error);
});