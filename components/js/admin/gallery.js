import { storage, database, app } from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

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
  fileText.style.fontSize = "10px"
  //Image preview
  if (fileItem) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("file-preview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(fileItem);
  }
};
window.getDetails = function (e) { };

window.uploadImage = function () {
  category = document.getElementById("category-input").value.trim();
  description = document.getElementById("description-input").value;
  if (!fileItem || !description || !category) {
    alert("Please fill all fields");
    return;
  }

  const storageReference = storageRef(storage, "image/" + fileName);
  const uploadTask = uploadBytesResumable(storageReference, fileItem);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      percentVal = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
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
};
function saveFileMetadata(fileName, fileURL, fileCategory, fileDescription) {
  const db = database;
  const indexRef = dbRef(db, 'fileIndex');
  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1;
    set(indexRef, newIndex).then(() => {
      const filesRef = dbRef(db, 'files/' + newIndex);
      set(filesRef, {
        fileName: fileName,
        fileURL: fileURL,
        index: newIndex,
        fileCat: fileCategory,
        fileDesc: fileDescription,
      })
        .then(() => {
          console.log("File metadata with index saved successfully!");
        }).then(window.location.reload)
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
  });
}

let closeButton;
let imageDiv;
window.getAllFiles = function () {
  const filesRef = dbRef(getDatabase(), "files");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get("key");
  console.log(value);
  get(filesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const filesData = snapshot.val();

        // let i=0;

        for (const fileIndex in filesData) {
          if (filesData.hasOwnProperty(fileIndex)) {
            const fileData = filesData[fileIndex];
            const fileCat = fileData.fileCat;

            const fileURL = fileData.fileURL;
            const fileName = fileData.fileName;

            imageDiv = document.createElement("div");
            imageDiv.className = "image-div";
            // imageDiv.id='imagediv'.concat(i);
            imageDiv.style.width = "30%";
            imageDiv.style.height = "40%";
            imageDiv.style.borderRadius = '7px';
            imageDiv.style.flexWrap = "wrap";
            imageDiv.style.overflow = 'hidden';

            closeButton = document.createElement("button");
            // closeButton.id='closebutton'.concat(i);
            closeButton.style.backgroundColor = "#DC143C";
            closeButton.style.width = "25px";
            closeButton.style.height = "25px";
            closeButton.style.borderRadius = "50%";
            closeButton.style.position = "relative";
            closeButton.style.left = "85%";
            closeButton.innerText = "X";
            closeButton.style.cursor = "pointer";
            imageDiv.appendChild(closeButton);
            const img = document.createElement("img");
            img.style.objectFit = 'cover';
            img.style.borderRadius = '7px';
            if (fileCat == value) {
              img.src = fileURL;
              img.alt = fileName;
              img.style.width = "100%";
              img.style.height = "100%"
              img.style.margin = "10px";

              imageDiv.appendChild(img);
              let imageContainer = document.getElementById("image-container");
              img.id = "image";
              imageContainer.appendChild(imageDiv);
            }
            closeButton.addEventListener("click", function () {
              removeImagefromFirebase(fileURL, fileIndex, imageDiv);
            });
          }
        }
      } else {
        console.log("No files found.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving files:", error);
    });
};
let previewIndex = 0;

window.previewBox = function () {
  if (
    document.getElementById("addimage").style.display != "none" &&
    previewIndex != 1
  ) {
    document.getElementById("addimage").style.display = "none";
  } else {
    document.getElementById("addimage").style.display = "flex";
    previewIndex = 1;
  }
};
window.discardBox = function () {
  document.getElementById("addimage").style.display = "none";
};
window.addEventListener("DOMContentLoaded", getAllFiles());

window.removeImagefromFirebase = function (fileURL, fileIndex, imageDiv) {
  const dbRefToDelete = dbRef(getDatabase(), "files/" + fileIndex);

  set(dbRefToDelete, null)
    .then(() => {
      console.log("Image metadata removed from Firebase Database");
      if (imageDiv && imageDiv.parentNode) {
        imageDiv.parentNode.removeChild(imageDiv);
      }
    })
    .catch((error) => {
      console.error("error deleteing image from firebase", error);
    });
};
