import { storage, database, app } from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

let fileText = document.querySelector(".fileText");
let uploadPercentage = document.querySelector(".uploadPercentage");
let progress = document.querySelector(".progress");
let loader = document.getElementById("loaderBg")

let percentVal;
let fileItem;
let fileName;
let category;
let description;



document.getElementById("file-preview").addEventListener('click',function(){
  document.getElementById("fileInp").click();
})

window.getFile = function (e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  // fileText.innerHTML = fileName;
  // fileText.style.fontSize = "10px"
  if (fileItem) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("file-preview");
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(fileItem);
  }
}
window.getDetails = function (e) { }

window.uploadImage = function () {
  category = document.getElementById("category-input").value;
  description = document.getElementById("description-input").value;
  loader.style.display = "flex";
  console.log(category)
  console.log(description)
  console.log(fileItem)
  if (!fileItem || !description || !category) {
    alert("Please fill all fields");
    return;
  }

  // Reference to the storage path
  const storageReference = storageRef(storage, "bannerimage/" + fileName);
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
  let isActive = 1;
  const indexRef = dbRef(db, 'fileIndex'); // Reference to a counter for file index

  // Read the current index value and increment it
  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1; // Increment the index, or start at 1

    // Save the incremented index to the database
    set(indexRef, newIndex).then(() => {
      const filesRef = dbRef(db, 'bannerfiles/' + newIndex); // Use the index as the key

      // Save the file metadata under the indexed entry
      set(filesRef, {
        fileName: fileName,
        fileURL: fileURL,
        index: newIndex,
        fileCat: fileCategory,
        fileDesc: fileDescription,
        isActive: isActive
      })
        .then(() => {
          console.log('File metadata with index saved successfully!');
          discardBox();
          loader.style.display = "none";
          getAllFiles();
        })
        .catch((error) => {
          console.error('Error saving file metadata:', error);
        });
    });
  });
}

let closeButton;
let imageDiv;
console.log('#1')
window.getAllFiles = function () {
  console.log('hii')
  const filesRef = dbRef(getDatabase(), 'bannerfiles');
  get(filesRef).then((snapshot) => {

    if (snapshot.exists()) {
      const filesData = snapshot.val();
      console.log(filesData);
      for (const fileIndex in filesData) {
        if (filesData.hasOwnProperty(fileIndex)) {
          const fileData = filesData[fileIndex];
          const fileCat = fileData.fileCat;
          const isActive = fileData.isActive;
          const fileURL = fileData.fileURL;
          const fileName = fileData.fileName;
          const fileDesc = fileData.fileDesc;

          let contentDiv = document.createElement('div');
          contentDiv.style.display = 'flex';
          contentDiv.style.flexDirection = 'row';

          let textSectionDiv = document.createElement('div');
          let heading = document.createElement('h3');
          heading.style.margin = '3px 0px 0px 0px';
          let desc = document.createElement('p');

          // Toggle switch
          let switchdiv = document.createElement('label');
          switchdiv.className = 'ios-switch';
          let toggle = document.createElement('input');
          toggle.className = 'checkbox';
          toggle.id = 'mytoggle';
          toggle.type = 'checkbox';
          toggle.checked = isActive === 1; // Set initial state based on the stored value in Firebase

          // Toggle event listener
          toggle.addEventListener('change', () => {
            const newStatus = toggle.checked ? 1 : 0;
            updateFileStatus(fileIndex, newStatus); // Update Firebase when toggled
          });

          let togglespan = document.createElement('span');
          let toggleDiv = document.createElement('div');
          toggleDiv.className = 'main-toggle-div'
          togglespan.className = 'slider';

          switchdiv.appendChild(toggle);
          switchdiv.appendChild(togglespan);
          toggleDiv.appendChild(switchdiv);
          desc.style.margin = '5px';
          heading.innerText = fileCat;
          desc.innerText = fileDesc;
          textSectionDiv.appendChild(heading);
          textSectionDiv.appendChild(desc);
          textSectionDiv.style.position = 'relative';
          textSectionDiv.style.left = '';
          textSectionDiv.style.width = '50%'
          textSectionDiv.style.flexWrap = 'wrap';
          contentDiv.style.width = '97%';
          contentDiv.style.backgroundColor = 'white';
          contentDiv.style.border = '1px solid black';
          contentDiv.style.margin = '5px';

          // Create an image element to display each file
          imageDiv = document.createElement('div');
          imageDiv.className = "image-div";
          closeButton = document.createElement('button');
          closeButton.className = 'close-button';
          closeButton.innerText = 'X';
          toggleDiv.appendChild(closeButton);

          const img = document.createElement('img');
          img.src = fileURL;
          img.alt = fileName;
          img.style.width = '100px'; // Optionally, set the image width
          img.style.margin = '10px';
          img.style.marginLeft = '0px';

          imageDiv.appendChild(img);
          let imageContainer = document.getElementById("image-container");
          img.id = "image";
          contentDiv.appendChild(imageDiv);
          contentDiv.appendChild(textSectionDiv);
          contentDiv.appendChild(toggleDiv);
          imageContainer.appendChild(contentDiv);

          closeButton.addEventListener('click', function () {
            removeImagefromFirebase(fileURL, fileIndex, imageDiv);
          })
        }
      }
    } else {
      console.log("No files found.");
    }
  }).catch((error) => {
    console.error("Error retrieving files:", error);
  });
}

// Update file status function
function updateFileStatus(fileIndex, isActiveStatus) {
  const db = getDatabase();
  const fileRef = dbRef(db, 'bannerfiles/' + fileIndex + '/isActive');

  set(fileRef, isActiveStatus)
    .then(() => {
      console.log(`File ${fileIndex} isActive updated to ${isActiveStatus}`);
    })
    .catch((error) => {
      console.error('Error updating isActive status:', error);
    });
}

let previewIndex = 0;

window.previewBox = function () {
  if (document.getElementById("addimage").style.display != "none" && previewIndex != 1) {
    document.getElementById("addimage").style.display = "none";
  } else {
    document.getElementById("addimage").style.display = "flex";
    previewIndex = 1;
  }
}
window.discardBox = function () {
  document.getElementById("addimage").style.display = "none";
  document.getElementById("file-preview").src = "https://firebasestorage.googleapis.com/v0/b/lndvconnect-6f4ac.appspot.com/o/images%2FUploadImage.png?alt=media&token=951c565a-08e9-4c18-ad67-ad498365d053"
  document.getElementById("category-input").value = "";
  document.getElementById("description-input").value = "";
}
window.addEventListener('DOMContentLoaded', getAllFiles())

window.removeImagefromFirebase = function (fileURL, fileIndex, imageDiv) {
  const dbRefToDelete = dbRef(getDatabase(), 'bannerfiles/' + fileIndex);

  set(dbRefToDelete, null)
    .then(() => {
      console.log('Image metadata removed from Firebase Database');
      if (imageDiv && imageDiv.parentNode) {
        imageDiv.parentNode.removeChild(imageDiv);
      }
    })
    .catch((error) => {
      console.error('Error deleting image from Firebase:', error);
    });
}
