import { storage,database} from "../calenderAPI.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";




function showaddannouncement(){
    const dref = ref(database);
    let div = document.getElementById('container');
  
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
  
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
        
        <h3>${courseName}</h3>
        <p>${startDate}</p>
        <p>${trainerName}</p>
        <div class="actions">
          <i class="fas fa-trash"></i>
          <i class="fas fa-edit"></i>
        </div>
      `;
  
  
      container.appendChild(card);
                
                
            })
        }
        else{
            let p = document.createElement('p');
            p.innerHTML = 'No files founded';
            div.appendChild(p);
        }
    })
  
  }
  
  showaddannouncement();
  