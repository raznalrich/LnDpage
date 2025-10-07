import { storage, database, app,ref } from "../Firebase.js";
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
  category = document.getElementById("category-id-hidden").value.trim();
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
          discardBox();
        }).then(window.location.reload)
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
  });
}

function saveCategory(title, date, desc, url) {
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

let closeButton;
let imageDiv;
// window.getAllFiles = function () {
//   const filesRef = dbRef(getDatabase(), "files");
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const value = urlParams.get("key");
//   console.log(value);
//   get(filesRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const filesData = snapshot.val();

//         // let i=0;

//         for (const fileIndex in filesData) {
//           if (filesData.hasOwnProperty(fileIndex)) {
//             const fileData = filesData[fileIndex];
//             const fileCat = fileData.fileCat;

//             const fileURL = fileData.fileURL;
//             const fileName = fileData.fileName;

//             imageDiv = document.createElement("div");
//             imageDiv.className = "image-div";
//             // imageDiv.id='imagediv'.concat(i);
//             imageDiv.style.width = "30%";
//             imageDiv.style.height = "40%";
//             imageDiv.style.borderRadius = '7px';
//             imageDiv.style.flexWrap = "wrap";
//             imageDiv.style.overflow = 'hidden';

//             closeButton = document.createElement("button");
//             // closeButton.id='closebutton'.concat(i);
//             closeButton.style.backgroundColor = "#DC143C";
//             closeButton.style.width = "25px";
//             closeButton.style.height = "25px";
//             closeButton.style.borderRadius = "50%";
//             closeButton.style.position = "relative";
//             closeButton.style.left = "85%";
//             closeButton.innerText = "X";
//             closeButton.style.cursor = "pointer";
//             imageDiv.appendChild(closeButton);
//             const img = document.createElement("img");
//             img.style.objectFit = 'cover';
//             img.style.borderRadius = '7px';
//             if (fileCat == value) {
//               img.src = fileURL;
//               img.alt = fileName;
//               img.style.width = "100%";
//               img.style.height = "100%"
//               img.style.margin = "10px";

//               imageDiv.appendChild(img);
//               let imageContainer = document.getElementById("image-container");
//               img.id = "image";
//               imageContainer.appendChild(imageDiv);
//             }
//             closeButton.addEventListener("click", function () {
//               removeImagefromFirebase(fileURL, fileIndex, imageDiv);
//             });
//           }
//         }
//       } else {
//         console.log("No files found.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error retrieving files:", error);
//     });
// };
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

        const imageContainer = document.getElementById("image-container");
        imageContainer.innerHTML = ''; // Clear existing gallery

        for (const fileIndex in filesData) {
          if (filesData.hasOwnProperty(fileIndex)) {
            const fileData = filesData[fileIndex];
            const fileCat = fileData.fileCat;

            if (fileCat === value) {
              const fileURL = fileData.fileURL;
              const fileName = fileData.fileName;

              const imageDiv = document.createElement("div");
              imageDiv.className = "image-div";

              const closeButton = document.createElement("button");
              closeButton.className = "close-button";
              closeButton.innerText = "X";
              closeButton.title = "Remove Image";
              imageDiv.appendChild(closeButton);

              const img = document.createElement("img");
              img.src = fileURL;
              img.alt = fileName;
              img.className = "gallery-image";
              imageDiv.appendChild(img);

              imageContainer.appendChild(imageDiv);

              closeButton.addEventListener("click", () => {
                removeImagefromFirebase(fileURL, fileIndex, imageDiv);
              });
            }
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

// Show category modal when image is clicked
window.showCategoryModal = function() {
  document.getElementById('category-modal').style.display = 'flex';
}

// Hide category modal
window.discardCategoryBox = function() {
  document.getElementById('category-modal').style.display = 'none';
  document.getElementById('category-name-input').value = '';
}

// Save category name for selected image
window.saveCategoryName = function() {
  const categoryName = document.getElementById('category-name-input').value;
  const categoryId = document.getElementById('category-id-hidden').value; // for editing

  if (categoryName) {
    const db = database;

    // Edit mode: If categoryId is present, update the category
    if (categoryId) {
      const filesRef = ref(db, "GalleryCategory/" + categoryId);

      set(filesRef, {
        categoryName: categoryName,
        index: parseInt(categoryId), // keep index property present
      })
      .then(() => {
        console.log("Gallery category updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
      // After save, clear hidden field and close
      document.getElementById('category-id-hidden').value = '';
      alert("Gallery category with index saved successfully!");
      discardCategoryBox();
         window.location.reload();
    } else {
      // Add mode: add new category as before
      const indexRef = ref(db, "galleryCategoryIndex");

      get(indexRef).then((snapshot) => {
        let newIndex = snapshot.exists() ? snapshot.val() + 1 : 1;

        set(indexRef, newIndex).then(() => {
          const filesRef = ref(db, "GalleryCategory/" + newIndex);

          set(filesRef, {
            categoryName: categoryName,
            index: newIndex,
          })
            .then(() => {
              alert("Gallery category with index saved successfully!");
              console.log("Gallery category with index saved successfully!");
              discardCategoryBox();
      window.location.reload();
            })
            .catch((error) => {
              console.error("Error saving category metadata:", error);
            });
        });
      });
      

    }
  }
}


let imageCategory = document.getElementById('image-category');

async function fetchCategoriesOnce() {
    const db = database;
  const categoriesRef = ref(db, "GalleryCategory"); // [web:3][web:9]
  try {
    const snapshot = await get(categoriesRef); // [web:2][web:3]
    const categories = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => { // iterate children to preserve keys and order [web:3]
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        categories.push({ id: key, ...data });
      });
    }
    console.log("Categories (once):", categories); // do DOM rendering instead if needed [web:3]
    categories.forEach((category) => {
                let categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-div';
                // categoryDiv.innerText = category;
                categoryDiv.style.width = '20%'
                categoryDiv.style.height = '10%';
                categoryDiv.style.background = '#D9D9D9'
                categoryDiv.style.margin = '2%'
                categoryDiv.style.display = 'flex';
                categoryDiv.style.justifyContent = 'center';
                categoryDiv.style.alignItems = 'center';

                let link = document.createElement('a');
                link.href = `../../admin/gallery.html?key=${category.id}`;
                link.innerText = category.categoryName;
                link.style.textDecoration = 'none';
                categoryDiv.appendChild(link);

                // Edit Button
    let editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.style.marginLeft = '10px';
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';
    editBtn.onclick = () => openEditCategoryModal(category.id, category.categoryName);

    categoryDiv.appendChild(editBtn);

                imageCategory.appendChild(categoryDiv);

                // let datalist=document.getElementById('options');
                // datalist.innerHTML+=`
                // <option value="${category.categoryName}">
                // `

            });
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
}
function openEditCategoryModal(categoryId, currentName) {
    document.getElementById('category-modal').style.display = 'block';
    document.getElementById('category-name-input').value = currentName;
    document.getElementById('category-id-hidden').value = categoryId;
}

fetchCategoriesOnce();

async function populateCategoryDropdown() {
  const db = database;
  const categoriesRef = ref(db, "GalleryCategory");
  try {
    const snapshot = await get(categoriesRef);
    const selectElem = document.getElementById('category-select');
    selectElem.innerHTML = '<option value="" disabled selected>Select a category</option>'; // reset options

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const option = document.createElement('option');
        option.value = data.categoryName;
        option.textContent = data.categoryName;
        option.dataset.categoryId = childSnapshot.key; // store the hidden ID here
        selectElem.appendChild(option);
      });
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}
document.getElementById('category-select').addEventListener('change', function() {
  const selectedOption = this.options[this.selectedIndex];
  const categoryId = selectedOption.dataset.categoryId || '';
  console.log(categoryId);
  
  document.getElementById('category-id-hidden').value = categoryId;
});

populateCategoryDropdown();

