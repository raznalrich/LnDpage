import { storage,database} from "../Firebase.js";
import { child, get, getDatabase, set,ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


let fileText = document.querySelector(".fileText");
let uploadPercentage = document.querySelector(".uploadPercentage");
let progress = document.querySelector(".progress");
let percentVal;
let fileItem;
let fileName;

window.getFile=function(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

window.uploadImage=function() {
  if (!fileItem) {
    alert("Please select a file first.");
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
        saveFileMetadata(fileName, url);
      });
    }
  );
}
function saveFileMetadata(fileName, fileURL) {
  const db = database;
  const indexRef = ref(db, 'fileIndex'); // Reference to a counter for file index

  // Read the current index value and increment it
  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? snapshot.val() + 1 : 1; // Increment the index, or start at 1

    // Save the incremented index to the database
    set(indexRef, newIndex).then(() => {
      const filesRef = ref(db, 'files/' + newIndex); // Use the index as the key

      // Save the file metadata under the indexed entry
      set(filesRef, {
        fileName: fileName,
        fileURL: fileURL,
        index: newIndex
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