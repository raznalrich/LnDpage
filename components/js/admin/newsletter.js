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

const form = document.getElementById("uploadFormNewsletter");
let fileInp = document.getElementById("htmlfile");
let loader = document.getElementById("loaderBg")
document.getElementById("html").addEventListener('click',function(){
fileInp.click();

})
window.getFile = function (e) {
  let fileItem = e.target.files[0];
 let fileName = fileItem.name;
 console.log(fileName);
 
  document.getElementById("filechosen").innerHTML = fileName;
  // fileText.style.fontSize = "10px"
  // if (fileItem) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //         const filechosen = document.getElementById("filechosen");
  //         console.log(filechosen);
          
  //         preview.src = e.target.result;
  //         // preview.style.display = "block";
  //     };
  //     reader.readAsDataURL(fileItem);
  // }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // const title = document.getElementById("title").value;
  const date = document.getElementById("text").value;
  const htmlfile = document.getElementById("htmlfile").files[0];
  loader.style.display = "flex";

  if (!htmlfile) {
    alert("Please upload an image.");
    return;
  }

  const storageReference = storageRef(storage, "newsletter/" + htmlfile.name);

  const uploadTask = uploadBytesResumable(storageReference, htmlfile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.error("Upload failed:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        saveFileMetadata(date, downloadURL);
        let addnewmenu = document.getElementById("addnewsletter");
        addnewmenu.style.display = "none";
      });
    }
  );
  // setTimeout(function() {
  //     window.location.reload();
  // }, 10000);
});

function saveFileMetadata(date, downloadURL) {
  const db = database;
  const indexRef = ref(db, "newsletterindex");

  get(indexRef).then((snapshot) => {
    let newIndex = 1;

    set(indexRef, newIndex).then(() => {
      const filesRef = ref(db, "newsletter/" + newIndex);

      set(filesRef, {

        date: date,
        htmlurl: downloadURL,

        index: newIndex,
      })
        .then(() => {
          console.log("File metadata with index saved successfully!");
          closeaddnewmenu();
          loader.style.display = "none";
          window.location.reload();

        })
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
  });
}

function shownewsletter() {
  const dref = ref(database);
  let div = document.getElementById("newslettershow");

  get(child(dref, "newsletter")).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((menu) => {
        let value = menu.val();

        let iframe = document.createElement("img");
        iframe.src = value.htmlurl;
        iframe.style.width = "100%"; 
        console.log(iframe);
        console.log(div);

        div.appendChild(iframe);
      });
    } else {
      let p = document.createElement("p");
      p.innerHTML = "No files founded";
      div.appendChild(p);
    }
  });
}

shownewsletter();

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
