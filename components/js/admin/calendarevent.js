

// function showaddannouncement(){
//     const dref = ref(database);
//     let div = document.getElementById('container');
  
//     get(child(dref,'courses')).then((snapshot)=>{
//         if(snapshot.exists()){
//             snapshot.forEach((menu)=>{
//                 let value = menu.val();
//                 console.log(value);
                
//                 const courseName = value.courseName;
//                 const startDate = value.startDate;
//                 const startTime = value.startTime;
//                 const endDate = value.endDate;
//                 const endTime = value.endTime;
//                 const keyPoints = value.keyPoints;
//                 const maxParticipation = value.maxParticipation;
//                 const targetAudience = value.targetAudience;
//                 const trainerName = value.trainerName;
//                 const mode = value.mode;
  
//                 const card = document.createElement('div');
//                 card.classList.add('card');
//                 card.innerHTML = `
        
//         <h3>${courseName}</h3>
//         <p>${startDate}</p>
//         <p>${trainerName}</p>
//         <div class="actions">
//           <i class="fas fa-trash"></i>
//           <i class="fas fa-edit"></i>
//         </div>
//       `;
  
  
//       container.appendChild(card);
                
                
//             })
//         }
//         else{
//             let p = document.createElement('p');
//             p.innerHTML = 'No files founded';
//             div.appendChild(p);
//         }
//     })
  
//   }
  
//   showaddannouncement();
  

function showAddAnnouncement() {
  const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";
  let container = document.getElementById('container');

  fetch(databaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        Object.values(data).forEach(menu => {
          const {
            courseName,
            startDate,
            startTime,
            endDate,
            endTime,
            keyPoints,
            maxParticipation,
            targetAudience,
            trainerName,
            mode
          } = menu;

          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <h3>${courseName}</h3>
            <p>Start Date: ${startDate}</p>
            <p>Trainer: ${trainerName}</p>
            <div class="actions">
              <i class="fas fa-trash"></i>
              <i class="fas fa-edit"></i>
            </div>
          `;

          container.appendChild(card);
        });
      } else {
        const p = document.createElement('p');
        p.innerHTML = 'No files found';
        container.appendChild(p);
      }
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

showAddAnnouncement();
