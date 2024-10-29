import { storage, database } from "../Firebase.js";
import {
  child,
  get,
  getDatabase,
  set,
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

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${desc}</p>
        <div class="actions">
          <i class="fas fa-trash"></i>
          <i class="fas fa-edit"></i>
        </div>
      `;

        container.appendChild(card);
      });
    } else {
      let p = document.createElement("p");
      p.innerHTML = "No files founded";
      div.appendChild(p);
    }
  });
}

showaddannouncement();

function displayaddnewmenu() {
  let addnewmenu = document.getElementById("addnewsletter");
  addnewmenu.style.display = "flex";
}
function closeaddnewmenu() {
  let addnewmenu = document.getElementById("addnewsletter");
  addnewmenu.style.display = "none";
}

document
  .getElementById("addbutton")
  .addEventListener("click", displayaddnewmenu);
document
  .getElementById("closebutton")
  .addEventListener("click", closeaddnewmenu);
