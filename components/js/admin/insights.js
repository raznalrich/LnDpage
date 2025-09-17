import { storage, database, app } from "../Firebase.js";
import { child, get, getDatabase, set, update, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

let fileText = document.querySelector(".fileText");
let uploadPercentage = document.querySelector(".uploadPercentage");
let progress = document.querySelector(".progress");
let fileinput = document.getElementById("fileInp");
let loader = document.getElementById("loaderBg")

let percentVal;
let fileItem;
let fileName;
let category;
let description;
let fileTitle;


document.getElementById("file-preview").addEventListener("click",function(){
    fileinput.click();
   
})

window.getFile = function (e) {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
    fileText.style.fontSize = "10px"
    if (fileItem) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById("file-preview");
            console.log(preview);
            
            preview.src = e.target.result;
            // preview.style.display = "block";
        };
        reader.readAsDataURL(fileItem);
    }
}

window.uploadImage = function () {
    category = document.getElementById("category-input").value;
    description = document.getElementById("description-input").value;
    fileTitle = document.getElementById("title-input").value;
    loader.style.display = "flex";
    if (!fileItem || !description || !category || !fileTitle) {
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
                saveFileMetadata(fileName, url, category, description , fileTitle);
            });
        }
    );
}
function saveFileMetadata(fileName, fileURL, fileCategory, fileDescription,fileTitle) {
    const db = database;
    const indexRef = dbRef(db, 'fileIndex');
    get(indexRef).then((snapshot) => {
        let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1;
        set(indexRef, newIndex).then(() => {
            const filesRef = dbRef(db, 'leaderfiles/' + newIndex);
            set(filesRef, {
                fileName: fileName,
                fileURL: fileURL,
                fileTitle:fileTitle,
                index: newIndex,
                fileCat: fileCategory,
                fileDesc: fileDescription
            })
                .then(() => {
                    console.log('File metadata with index saved successfully!');
                    discardBox();
                    loader.style.display = "none";
                    // getAllFiles();
                    window.location.reload();

                })
                .catch((error) => {
                    console.error('Error saving file metadata:', error);
                });
        });
    });
    discardBox();
}

console.log('front of getAllFiles')
window.getAllFiles = function () {
    console.log('this is sample')

    const filesRef = dbRef(getDatabase(), 'leaderfiles'); // Reference to the 'files' node
    get(filesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const filesData = snapshot.val();

            for (const fileIndex in filesData) {
                if (filesData.hasOwnProperty(fileIndex)) {
                    const fileData = filesData[fileIndex];
                    const fileCat = fileData.fileCat;
                    const fileDes = fileData.fileDesc;
                    const fileURL = fileData.fileURL;
                    const fileName = fileData.fileName;
                    const fileTitle = fileData.fileTitle;

                    // Create the card element
                    // Create the card element
                    let cardContainer = document.getElementById('card-container');
                    let card = document.createElement('div');
                    card.classList.add('card');

                    // Set up the card's inner HTML structure
                    card.innerHTML = `
                        <div class="leader-image-container">
                            <img src="${fileURL}" alt="${fileName}" class="leader-image" style="width: 30px; height:30px; border-radius:50% margin: 10px;" />
                        </div>
                        <div style="width: 100%;" class="description-container">
                         <h3 style="width: 100%;" class="leader-heading">${fileCat}</h3>
                         <span style="font-size: 10px;color: #888888; font-style: italic; letter-spacing: 0.01em;" class="leader-quote">${fileTitle}</span>
                        <p style="width: 100%;" class="leader-quote">${fileDes}</p>
                        <div style="width: 100%;" class="actions">
                            <i class="fas fa-trash deleteButton"></i>
                            <i class="fas fa-edit editButton" value=${fileIndex}></i>
                        </div>
                        </div>
                    `;

                    // Append the card to the main container
                    cardContainer.appendChild(card);

                    // Set up delete functionality
                    const closeButton = card.querySelector('.deleteButton');
                    const editButton = card.querySelector('.editButton');
                    closeButton.addEventListener('click', function () {
                        removeImagefromFirebase(fileURL, fileIndex, card);
                    });

                    editButton.addEventListener('click', function () {
                        toggle = 1;
                        previewBox(fileIndex);
                        editImageInFirebase(fileData);
                        toggle = 0;
                    });
                }
            }
        } else {
            console.log("No files found.");
        }
    }).catch((error) => {
        console.error("Error retrieving files:", error);
    });
}
window.editImageInFirebase = function (fileData, fileIndex) {
    let imageContent = document.getElementById('file-input');
    let imgPreview = document.getElementById('file-preview')
    let descContent = document.getElementById('description-input');
    let catContent = document.getElementById('category-input');
    let titleContent = document.getElementById('title-input');
    imgPreview.src = fileData.fileURL;
    
    // imageContent.value=`${fileData.fileURL}`;
    descContent.value = `${fileData.fileDesc}`;
    catContent.value = `${fileData.fileCat}`;
    titleContent.value = `${fileData.fileTitle}`;
    // imageContent.innerHTML = `${fileData.fileName}`;



}
function updateFileMetadata(fileName,url,newCategory,newDescription,fileIndex,newTitle){
    const dbRefToUpdate = dbRef(getDatabase(), 'leaderfiles/' + fileIndex);
    update(dbRefToUpdate, {
        fileName:fileName,
        fileURL:url,
        fileCat: newCategory,
        fileDesc: newDescription,
        fileTitle:newTitle
    }).then(() => {
        console.log('image data updated successfully');
    }).catch((error) => {
        console.error('error updating data', error);
    })
    discardBox();
    location.reload();
}
window.updateContent = function (fileIndex) {
    // let effectiveFileName = fileName;
    // console.log("file name",effectiveFileName);
    
    // effectiveFileName = document.getElementById('title-input').getAttribute('data-filename') || effectiveFileName;
    // const storageReference = storageRef(storage, "leaderimages/" + effectiveFileName);
    // const uploadTask = uploadBytesResumable(storageReference, fileItem);
    let newDescription = document.getElementById('description-input').value;
    let newCategory = document.getElementById('category-input').value;
    let newTitle = document.getElementById('title-input').value;
    let newFileName = document.getElementById("file-preview")   ;

     // New file selected - upload new file to storage
    const storageReference = storageRef(storage, "leaderimages/" + newFileName.name);
    const uploadTask = uploadBytesResumable(storageReference, fileItem);

    // Check if there's a new file to upload
    if (!fileItem) {
        // No new file selected - update metadata only using existing fileName and URL
        const existingFileName = fileName || "";  // fallback if undefined
        const existingFileURL = document.getElementById('file-preview').src;

        updateFileMetadata(existingFileName, existingFileURL, newCategory, newDescription, fileIndex, newTitle);
        return;
    }

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
                updateFileMetadata(newFileName, url, newCategory, newDescription,fileIndex,newTitle);
            });
        }
    );
        

}



let previewIndex = 0
let toggle = 0;
let buttonSection = document.getElementById('button-section');
let button = document.createElement('button');
window.previewBox = function (fileIndex) {

    button.id = 'save';
    if (document.getElementById("addimage").style.display != "none" && previewIndex != 1) {
        document.getElementById("addimage").style.display = "none";
    } else {
        document.getElementById("addimage").style.display = "flex"
        previewIndex = 1;
    }
    if (toggle == 0) {
        buttonSection.innerHTML = `
        <button onclick="discardBox()">discard</button>
          <button onclick="uploadImage()" id="save">save</button>
        `;
    } else {
        buttonSection.innerHTML = `
            <button onclick="discardBox()" id="discard-button">discard</button>
          <button onclick="updateContent(${fileIndex})" id="update">update</button>
        `;
    }
}
window.discardBox = function () {
    document.getElementById("addimage").style.display = "none"
    document.getElementById("file-preview").src = "https://firebasestorage.googleapis.com/v0/b/lndvconnect-6f4ac.appspot.com/o/icons%2FaddIcon.png?alt=media&token=8801a2e8-d627-4f96-bd59-26e3604363ea";
    document.getElementById("category-input").value ="";
    document.getElementById("description-input").value ="";
    document.getElementById("title-input").value ="";
    // buttonSection.removeChild(button);
}
// window.addEventListener('DOMContentLoaded',getAllFiles())

window.removeImagefromFirebase = function (fileURL, fileIndex, imageDiv) {

    const dbRefToDelete = dbRef(getDatabase(), 'leaderfiles/' + fileIndex);

    set(dbRefToDelete, null)
        .then(() => {
            console.log('Image metadata removed from Firebase Database');
            if (imageDiv && imageDiv.parentNode) {
                imageDiv.parentNode.removeChild(imageDiv);
            }
        })
        .catch((error) => {
            console.error('error deleteing image from firebase', error)
        })
}