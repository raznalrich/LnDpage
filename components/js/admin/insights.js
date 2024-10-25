import { storage, database ,app} from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

let fileText = document.querySelector(".fileText");
let uploadPercentage = document.querySelector(".uploadPercentage");
let progress = document.querySelector(".progress");
let percentVal;
let fileItem;
let fileName;
let category;
let description;

window.getFile = function (e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}
window.getDetails = function (e) {

}


window.uploadImage = function () {
  category = document.getElementById("category-input").value;
  description = document.getElementById("description-input").value;
  if (!fileItem || !description || !category) {
    alert("Please fill all fields");
    return;
  }

  // Reference to the storage path
  const storageReference = storageRef(storage, "leaderimages/" + fileName);
  const uploadTask = uploadBytesResumable(storageReference, fileItem);

  uploadTask.on("state_changed",
    (snapshot) => {
      // Progress calculation
      percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log(percentVal);
      uploadPercentage.innerHTML = percentVal + "%";
      progress.style.width = percentVal + "%";
    },
    (error) => {
      console.log("Error during upload:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log("File available at:", url);
        saveFileMetadata(fileName, url, category, description);
      });
    }
  );
}
function saveFileMetadata(fileName, fileURL, fileCategory, fileDescription) {
  const db = database;
  const indexRef = dbRef(db, 'fileIndex'); 
  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1; 
    set(indexRef, newIndex).then(() => {
      const filesRef = dbRef(db, 'leaderfiles/' + newIndex); 
      set(filesRef, {
        fileName: fileName,
        fileURL: fileURL,
        index: newIndex,
        fileCat: fileCategory,
        fileDesc: fileDescription
      })
        .then(() => {
          console.log('File metadata with index saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving file metadata:', error);
        });
    });
  });

}



let previewIndex=0

window.previewBox = function () {
  if (document.getElementById("addimage").style.display != "none" && previewIndex!=1) {
    document.getElementById("addimage").style.display = "none"
  } else {
    document.getElementById("addimage").style.display = "flex"
    previewIndex=1;
  }
}
window.discardBox=function(){
  document.getElementById("addimage").style.display = "none"
}
// window.addEventListener('DOMContentLoaded',getAllFiles())

window.removeImagefromFirebase=function(fileURL,fileIndex,imageDiv){

const dbRefToDelete = dbRef(getDatabase(), 'files/' + fileIndex); 

  set(dbRefToDelete, null) 
    .then(() => {
      console.log('Image metadata removed from Firebase Database');
      if (imageDiv && imageDiv.parentNode) {
        imageDiv.parentNode.removeChild(imageDiv); 
      }
    })
.catch((error)=>{
    console.error('error deleteing image from firebase',error)
  })
}
