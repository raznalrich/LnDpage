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
  let isActive=1;
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
        isActive:isActive
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
          const fileCat=fileData.fileCat;
          const isActive=fileData.isActive;
          const fileURL = fileData.fileURL;
          const fileName = fileData.fileName;
          const fileDesc=fileData.fileDesc;
          
          let contentDiv=document.createElement('div');
          contentDiv.style.display='flex';
          contentDiv.style.flexDirection='row';
          
          let textSectionDiv=document.createElement('div');
        

          let heading=document.createElement('h3');
          heading.style.margin='3px 0px 0px 0px'
          let desc=document.createElement('p');
          let switchdiv=document.createElement('label');
          switchdiv.className='ios-switch'
          let toggle=document.createElement('input');
          toggle.className='checkbox';
          toggle.id='mytoggle';
          let togglespan=document.createElement('span');
          togglespan.className='slider';
          switchdiv.appendChild(toggle);
          switchdiv.appendChild(togglespan);
          toggle.type='checkbox';
          desc.style.margin='5px'
          heading.innerText=fileCat;
          
          desc.innerText=fileDesc;
          textSectionDiv.appendChild(heading);
          textSectionDiv.appendChild(desc);
          textSectionDiv.style.position='relative';
          textSectionDiv.style.left='10%';
            textSectionDiv.style.flexWrap='wrap'
          contentDiv.style.width='97%'
          contentDiv.style.backgroundColor='white';
          contentDiv.style.border='1px solid black'
          contentDiv.style.margin='5px'
          // Create an image element to display each file
          imageDiv=document.createElement('div');
          imageDiv.className="image-div";
          // imageDiv.id='imagediv'.concat(i);
          imageDiv.style.width='50px';
          imageDiv.style.height='auto'
          imageDiv.style.flexWrap='wrap';
          closeButton=document.createElement('button');
          // closeButton.id='closebutton'.concat(i);
          closeButton.style.backgroundColor='#DC143C';
          closeButton.style.width='25px';
          closeButton.style.height='25px';
          closeButton.style.borderRadius='50%';
          closeButton.style.position='relative';
          closeButton.style.left='95%';
          
          closeButton.innerText='X';
          closeButton.style.cursor='pointer';
          contentDiv.appendChild(closeButton);
          const img = document.createElement('img');
         
          img.src = fileURL;
          img.alt = fileName;
          img.style.width = '100px'; // Optionally, set the image width
          img.style.margin = '10px'; 
          img.style.marginLeft = '0px'; 
          // Optionally, add some margin between images
          
          imageDiv.appendChild(img);
          let imageContainer=document.getElementById("image-container");
          img.id="image";
          contentDiv.appendChild(imageDiv);
          contentDiv.appendChild(textSectionDiv);
          contentDiv.append(switchdiv);
          imageContainer.appendChild(contentDiv);
         
          closeButton.addEventListener('click',function(){
            removeImagefromFirebase(fileURL,fileIndex,imageDiv);
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

window.removeImagefromFirebase=function(fileURL,fileIndex,imageDiv){

    const dbRefToDelete = dbRef(getDatabase(), 'bannerfiles/' + fileIndex); 

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


