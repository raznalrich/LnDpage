

import { storage, database } from "../calenderAPI.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

//removed the code of swipper for slideshow from here to front-page-swipper

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
