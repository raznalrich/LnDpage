import { storage, database } from "../Firebase.js";
import {
  child,
  get,
  getDatabase,
  set,
  update,
  ref,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const form = document.getElementById("uploadFormannouncement");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  const url = document.getElementById("url").value;

  // if (!htmlfile) {
  //     alert("Please upload an image.");
  //     return;
  // }

  saveFileMetadata(title, date, desc, url);
  let addnewmenu = document.getElementById("addnewsletter");
  addnewmenu.style.display = "none";

  // setTimeout(function() {
  //     window.location.reload();
  // }, 10000);
});

function saveFileMetadata(title, date, desc, url) {
  const db = database;
  const indexRef = ref(db, "announcementindex");

  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? snapshot.val() + 1 : 1;

    set(indexRef, newIndex).then(() => {
      const filesRef = ref(db, "announcement/" + newIndex);

      set(filesRef, {
        title: title,
        date: date,
        desc: desc,
        url: url,

        index: newIndex,
      })
        .then(() => {
          console.log("File metadata with index saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
  });
}
let closeButton;
let editButton;
function showaddannouncement() {
  const dref = ref(database);
  let div = document.getElementById("container");

  get(child(dref, "announcement")).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((menu) => {
        let value = menu.val();
        const title = value.title;
        const desc = value.desc;
        const date = value.date;
        const fileIndex=value.index;
        console.log(fileIndex);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${desc}</p>
        <div class="actions">
          <i class="fas fa-trash deleteButton"></i>
          <i class="fas fa-edit editButton "></i>
        </div>
      `;

        container.appendChild(card);


        const deleteButton=card.querySelector('.deleteButton');
        const editButton=card.querySelector('.editButton');
        console.log(closeButton);
        deleteButton.addEventListener('click',function(){
          console.log('REACHED LISTENER')
          removeAnnouncementFromFirebase(fileIndex,card);
        });

        editButton.addEventListener('click',()=>{
            toggle=1;
            console.log(value);
            displayaddnewmenu(fileIndex,value);
            
            // editAnnouncementInFirebase(fileData);
            toggle=0;
        });
      });
    } else {
      let p = document.createElement("p");
      p.innerHTML = "No files founded";
      div.appendChild(p);
    }
  });
}
function removeAnnouncementFromFirebase(fileIndex,card){
  const dbRefToDelete = ref(getDatabase(), 'announcement/' + fileIndex);

  set(dbRefToDelete, null)
      .then(() => {
          console.log('Image metadata removed from Firebase Database');
          if (card && card.parentNode) {
              card.parentNode.removeChild(card);
          }
      })
      .catch((error) => {
          console.error('error deleteing image from firebase', error)
      });
}
showaddannouncement();
let toggle=0;
function displayaddnewmenu(fileIndex,data) {
 
  console.log('box function')

  if(toggle==0){
    let update=document.getElementById('addnewsletter');
    update.style.display='flex'
  }else{
    let addnewmenu = document.getElementById("updatenewsletter");
    
    console.log(fileIndex);
    const parent=document.getElementById('updatenewsletter');
    const title=parent.querySelector('#title')
    const desc=parent.querySelector('#desc')
    const date=parent.querySelector('#date')
    const  url=parent.querySelector('#url')

    title.value=`${data.title}`;
    desc.value=`${data.desc}`;
    date.value=`${data.date}`;
    url.value=`${data.url}`;
    addnewmenu.style.display = "flex";

    const newtitle=parent.querySelector('#title')
    const newdesc=parent.querySelector('#desc')
    const newdate=parent.querySelector('#date')
    const  newurl=parent.querySelector('#url')
    
    // updateContents(fileIndex,newtitle,newdesc,newdate,newurl);
    let parentUpdate=document.getElementById('updatenewsletter');
    let button=parentUpdate.querySelector('#update');
    button.addEventListener('click',()=>{
      updateContents(fileIndex,newtitle.value,newdesc.value,newdate.value,newurl.value);
    });

  }

}
function closeaddnewmenu() {
  let addnewmenu = document.getElementById("addnewsletter");
  addnewmenu.style.display = "none";

  let update = document.getElementById("updatenewsletter");
  update.style.display = "none";
}

document
  .getElementById("addbutton")
  .addEventListener("click", displayaddnewmenu);
document
  .querySelector(".closebutton")
  .addEventListener("click", closeaddnewmenu);

document.querySelector('.updateclosebutton').addEventListener("click",closeaddnewmenu)


// function updateContents(fileIndex,title,desc,date,url){

//   const dbRefToUpdate = ref(getDatabase(), 'announcement/' + fileIndex);
//   update(dbRefToUpdate,{
//       title:title,
//       desc:desc,
//       date:date,
//       url:url,
//   }).then(()=>{
//       console.log('image data updated successfully');
//   }).catch((error)=>{
//       console.error('error updating data',error);
//   })
// }
function updateContents(fileIndex, title, desc, date, url) {
  const dbRefToUpdate = ref(getDatabase(), 'announcement/' + fileIndex); 
  console.log(title,desc);
  update(dbRefToUpdate, {
    title: title,
    desc: desc,
    date: date,
    url: url,
  })
    .then(() => {
      console.log('Announcement data updated successfully');
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
}




