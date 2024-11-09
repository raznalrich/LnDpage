import { storage, database, app } from "../Firebase.js";
import { child, get, getDatabase,update, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

let fileText = document.querySelector(".fileText");
let uploadPercentage = document.querySelector(".uploadPercentage");
let progress = document.querySelector(".progress");
let percentVal;
let fileItem;
let fileName;
let category;
let description;
let positionIndex;

function getPosition(){
  const filesRef = dbRef(getDatabase(), 'bannerfiles');
  get(filesRef).then((snapshot) =>{
    if (snapshot.exists()) {
      const filesData = snapshot.val();
      console.log(filesData);
      for(const fileIndex in filesData){
        let fileData=filesData[fileIndex];
        positionIndex=fileData.position;
      }
    }else{
      positionIndex=1;
    }
  });
}
getPosition();

window.getFile = function (e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
  fileText.style.fontSize = "10px"
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
  console.log(category)
  console.log(description)
  console.log(fileItem)
  if (!fileItem || !description || !category) {
    alert("Please fill all fields");
    return;
  }

  const storageReference = storageRef(storage, "bannerimage/" + fileName);
  const uploadTask = uploadBytesResumable(storageReference, fileItem);

  uploadTask.on("state_changed",
    (snapshot) => {
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
  let isActive = 1;
  const indexRef = dbRef(db, 'fileIndex'); 

  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1;
    positionIndex++;
   
    set(indexRef, newIndex).then(() => {
      const filesRef = dbRef(db, 'bannerfiles/' + newIndex);
      set(filesRef, {
        fileName: fileName,
        fileURL: fileURL,
        index: newIndex,
        fileCat: fileCategory,
        fileDesc: fileDescription,
        isActive: isActive,
        position: positionIndex
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
          const position=fileData.position;
          const dataIndex=fileData.index;
          console.log(position)
          let contentDiv = document.createElement('div');
          contentDiv.classList.add("draggableItem");
          contentDiv.draggable='true';
          contentDiv.setAttribute("data-index",dataIndex)
          contentDiv.dataset.position=`${position}`;
          contentDiv.style.display = 'flex';
          contentDiv.style.flexDirection = 'row';

          let textSectionDiv = document.createElement('div');
          let heading = document.createElement('h3');
          heading.style.margin = '3px 0px 0px 0px';
          let desc = document.createElement('p');


          let switchdiv = document.createElement('label');
          switchdiv.className = 'ios-switch';
          let toggle = document.createElement('input');
          toggle.className = 'checkbox';
          toggle.id = 'mytoggle';
          toggle.type = 'checkbox';
          toggle.checked = isActive === 1;


          toggle.addEventListener('change', () => {
            const newStatus = toggle.checked ? 1 : 0;
            updateFileStatus(fileIndex, newStatus);
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

let isDragging = false;
let currentItem = null;
let containerOffsetY = 0;
let initY = 0;

const container = document.querySelector(".slidebar-content");
container.style.width = container.offsetWidth + "px";
container.style.height = container.offsetHeight + "px";

document.addEventListener("mousedown", (e) => {
  const item = e.target.closest(".draggableItem");
  if (item) {
    isDragging = true;
    currentItem = item;
    containerOffsetY = currentItem.offsetTop;
    currentItem.classList.add("dragging");
    document.body.style.userSelect = "none";
    currentItem.classList.add("insert-animation");
    currentItem.style.top = containerOffsetY + "px";
    initY = e.clientY;
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && currentItem) {
    currentItem.classList.remove("insert-animation");
    let newTop = containerOffsetY - (initY - e.clientY);
    if (newTop < -50) {
      newTop = -50;
    } else if (newTop > container.offsetHeight - 30) {
      newTop = container.offsetHeight - 30;
    }
    currentItem.style.top = newTop + "px";

    let itemSiblings = [
      ...document.querySelectorAll(".draggableItem:not(.dragging)"),
    ];
    let nextItem = itemSiblings.find((sibling) => {
      return (
        e.clientY - container.getBoundingClientRect().top <=
        sibling.offsetTop + sibling.offsetHeight / 2
      );
    });

    itemSiblings.forEach((sibling) => {
      sibling.style.marginTop = "1px";
    });

    if (nextItem) {
      nextItem.style.marginTop = currentItem.offsetHeight + 5 + "px";
    }
    container.insertBefore(currentItem, nextItem);
  }
});

document.addEventListener("mouseup", () => {
  if (currentItem) {
    currentItem.classList.remove("dragging");
    currentItem.style.top = "auto";
    currentItem = null;
    isDragging = false;

    document.body.style.userSelect = "auto";
  }

  let itemSiblings = [
    ...document.querySelectorAll(".draggableItem:not(.dragging)"),
  ];

  itemSiblings.forEach((sibling) => {
    sibling.style.marginTop = "1px";
  });

  // Call function to update data-position attributes after drag ends
  updatePositions();
});

// Function to update the data-position attribute based on order in the DOM
function updatePositions() {
  const updatedItems = document.querySelectorAll(".draggableItem");
  updatedItems.forEach((item, index) => {
    item.setAttribute("data-position", index + 1); 
    const itemId = item.getAttribute("data-index");
    const newPosition = index + 1;
    const fileRef=dbRef(getDatabase(),`bannerfiles/${itemId}`)
    update(fileRef,{
      position:newPosition
    })
   
  });

  console.log(
    Array.from(updatedItems).map(item => ({
      text: item.innerText,
      position: item.getAttribute("data-position")
    }))
  );
}
