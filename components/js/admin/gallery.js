import { storage, database } from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

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
  const storageReference = storageRef(storage, "image/" + fileName);
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
      // Get the download URL on successful upload
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log("File available at:", url);
        saveFileMetadata(fileName, url, category, description);
      });
    }
  );
}
function saveFileMetadata(fileName, fileURL, fileCategory, fileDescription) {
  const db = database;
  const indexRef = dbRef(db, 'fileIndex'); // Reference to a counter for file index

  // Read the current index value and increment it
  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1; // Increment the index, or start at 1

    // Save the incremented index to the database
    set(indexRef, newIndex).then(() => {
      const filesRef = dbRef(db, 'files/' + newIndex); // Use the index as the key

      // Save the file metadata under the indexed entry
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

let closeButton;
let imageDiv;
window.getAllFiles = function () {
  const filesRef = dbRef(getDatabase(), 'files');  // Reference to the 'files' node

  get(filesRef).then((snapshot) => {
    if (snapshot.exists()) {
      const filesData = snapshot.val();

      let i=0;
      // Iterate over all the files
      for (const fileIndex in filesData) {
        if (filesData.hasOwnProperty(fileIndex)) {
          const fileData = filesData[fileIndex];
          const fileURL = fileData.fileURL;
          const fileName = fileData.fileName;
          

          // Create an image element to display each file
          imageDiv=document.createElement('div');
          imageDiv.className="image-div";
          imageDiv.id='imagediv'.concat(i);
          imageDiv.style.width='30%';
          imageDiv.style.flexWrap='wrap';
          closeButton=document.createElement('button');
          closeButton.id='closebutton'.concat(i);
          closeButton.style.backgroundColor='#DC143C';
          closeButton.style.width='25px';
          closeButton.style.height='25px';
          closeButton.style.borderRadius='50%';
          closeButton.style.position='relative';
          closeButton.style.left='85%';
          closeButton.innerText='X';
          closeButton.style.cursor='pointer';
          imageDiv.appendChild(closeButton);
          const img = document.createElement('img');
        
          img.src = fileURL;
          img.alt = fileName;
          img.style.width = '200px'; // Optionally, set the image width
          img.style.margin = '10px'; // Optionally, add some margin between images

          // Append the image to the body or any container in your HTML
          // document.body.appendChild(img);
          imageDiv.appendChild(img);
          let imageContainer=document.getElementById("image-container");
          img.id="image";
          imageContainer.appendChild(imageDiv);

          closeButton.addEventListener('click',function(){
            removeImagefromFirebase(fileURL,fileIndex,imageDiv);
          })
         

          i++;
        }
      }
    } else {
      console.log("No files found.");
    }
  }).catch((error) => {
    console.error("Error retrieving files:", error);
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
window.addEventListener('DOMContentLoaded',getAllFiles())


