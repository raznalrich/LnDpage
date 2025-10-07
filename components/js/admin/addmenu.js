import { storage, database } from "../Firebase.js";
import {
  child,
  get,
  getDatabase,
  set,
  ref,
  remove
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const form = document.getElementById("uploadForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const imageFile = document.getElementById("image").files[0];

  // if (!imageFile) {
  //   alert("Please upload an image.");
  //   return;
  // }
  if (!imageFile && !selectedIcon) {
    alert("Please select an icon or upload an image.");
    return;
  }

  const storageReference = storageRef(storage, "icons/" + imageFile.name);

  const uploadTask = uploadBytesResumable(storageReference, imageFile);

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
        saveFileMetadata(title, url, downloadURL);
        let addnewmenu = document.getElementById("addnewmenu");
        addnewmenu.style.display = "none";
      });
    }
  );
  setTimeout(function () {
    window.location.reload();
  }, 10000);
});

function saveFileMetadata(title, url, downloadURL) {
  const db = database;
  const indexRef = ref(db, "menuindex");

  get(indexRef).then((snapshot) => {
    let newIndex = snapshot.exists() ? snapshot.val() + 1 : 1;

    set(indexRef, newIndex).then(() => {
      const filesRef = ref(db, "menuicons/" + newIndex);

      set(filesRef, {
        title: title,
        url: url,
        imageUrl: downloadURL,
        active: 1,
        index: newIndex,
      })
        .then(() => {
          console.log("File data with index saved successfully!");
           alert("Menu item addedd successfully!");
      window.location.reload();
        })
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
  });
}

window.deleteFileMetadata = function(index) {
  const db = database;
  const itemRef = ref(db, "menuicons/" + index);

  remove(itemRef)
    .then(() => {
      console.log("File data with index " + index + " deleted successfully!");
      alert("Menu item deleted successfully!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error deleting file metadata:", error);
    });
}





let id = 1;
function displayaddnewmenu() {
  let addnewmenu = document.getElementById("addnewmenu");
  addnewmenu.style.display = "flex";
}
function closeaddnewmenu() {
  let addnewmenu = document.getElementById("addnewmenu");

  addnewmenu.style.display = "none";
  document.getElementById("title").value = " ";
  document.getElementById("url").value = " ";
  document.getElementById("addIconImg").src = "../../assets/addIcon.png";
}
function displayEditmenu(menuData) {
  let addnewmenu = document.getElementById("addnewmenu");
  addnewmenu.style.display = "flex";

  // Set initial values for title and URL
  document.getElementById("title").value = menuData.title;
  document.getElementById("url").value = menuData.url;
  document.getElementById("addIconImg").src = menuData.imageUrl;

  const iconSelector = document.getElementById("iconSelector");
  iconSelector.value = menuData.imageUrl || "";

  document.getElementById("image").addEventListener("change", function (e) {
    const file = e.target.files[0];
  
    // Ensure a file is selected and it is an SVG file
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById("addIconImg").src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid SVG file.");
      e.target.value = ""; // Clear the input if it's not a valid SVG
    }
  });

  document.getElementById("image").value = "";


  iconSelector.addEventListener("change", function () {
    document.getElementById("addIconImg").src = this.value;
  });


  const form = document.getElementById("addnewmenu");
  form.onsubmit = (e) => {
    e.preventDefault();
    updateMenuDetails(menuData.index, menuData.imageUrl);
  };
}


function updateMenuDetails(index, currentImageUrl) {
  const newTitle = document.getElementById("title").value;
  const newUrl = document.getElementById("url").value;
  const selectedIcon = document.getElementById("iconSelector").value;
  const newImageFile = document.getElementById("image").files[0];

  const db = database;
  const fileRef = ref(db, `menuicons/${index}`);

 
  let imageUrlPromise;

  if (newImageFile) {
 
    const storageReference = storageRef(storage, "icons/" + newImageFile.name);
    const uploadTask = uploadBytesResumable(storageReference, newImageFile);
    imageUrlPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  } else if (selectedIcon) {
    // Use selected icon from dropdown
    imageUrlPromise = Promise.resolve(selectedIcon);
  } else {
    // If no new icon or upload, retain current image
    imageUrlPromise = Promise.resolve(currentImageUrl);
  }

  // Once image URL is determined, update database
  imageUrlPromise
    .then((imageUrl) => {
      set(fileRef, {
        title: newTitle,
        url: newUrl,
        imageUrl: imageUrl,
        active: 1,
        index: index,
      }).then(() => {
        console.log("Menu item updated successfully!");
        closeaddnewmenu();
        adminlistmenu(); // Refresh list
      });
    })
    .catch((error) => {
      console.error("Error updating menu details:", error);
    });
}


document.getElementById("addMenu").addEventListener("click", displayaddnewmenu);
document
  .getElementById("closebutton")
  .addEventListener("click", closeaddnewmenu);

function adminlistmenu() {
  const dref = ref(database);
  let left = document.getElementById("left"); // Active Menu Container
  let right = document.getElementById("right"); // Disabled Menu Container
  let right_box = document.getElementById("right");

  left.innerHTML = "";
  right.innerHTML = "";

  get(child(dref, "menuicons"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((menu) => {
          let value = menu.val();

          let li = document.createElement("div");
          li.draggable = true;
          li.classList.add("list");
          li.id = "menu_" + value.index;
          li.dataset.menuData = JSON.stringify(value);

          li.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", li.id);
          });
          const leftdiv = document.createElement("div");
          leftdiv.classList.add("iconAndName");
        

          const img = document.createElement("img");
          img.src = value.imageUrl;
          img.alt = value.title;

          const p = document.createElement("p");
          p.textContent = value.title;

         const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";         // optional styling to align horizontally
buttonContainer.style.gap = "8px";               // space between buttons

const editButton = document.createElement("i");
editButton.classList = "fa-solid fa-edit fa-lg";
editButton.style.color = "#000";
editButton.addEventListener("click", () => displayEditmenu(value));

const deleteButton = document.createElement("i");
deleteButton.classList = "fa-solid fa-trash fa-lg";
deleteButton.style.color = "#d10d0dff";
deleteButton.addEventListener("click", () => deleteFileMetadata(value.index));

// Append buttons to container div
buttonContainer.appendChild(editButton);
buttonContainer.appendChild(deleteButton);
          


          leftdiv.appendChild(img);
          leftdiv.appendChild(p);
          li.appendChild(leftdiv)
          li.appendChild(buttonContainer)



          if (value.active === 1) {
            left.appendChild(li);
          } else {
            right.appendChild(li);
          }
        });

        // left.appendChild(li);

        setupDropZone(right);
        setupDropZone(left);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
adminlistmenu();

function dragging() {
  let lists = document.getElementsByClassName("list");
  let rightbox = document.getElementById("right");
  let leftbox = document.getElementById("left");

  for (let list of lists) {
    list.addEventListener("dragstart", function (e) {
      let selected = e.target;
      rightbox.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      rightbox.addEventListener("drop", function (e) {
        rightbox.appendChild(selected);
        selected = null;
      });
    });
  }
}
dragging();

function setupDropZone(target) {
  target.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  target.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);

    if (draggedElement) {
      target.appendChild(draggedElement);

      const menuData = JSON.parse(draggedElement.dataset.menuData);

      const newActiveStatus = target.id === "left" ? 1 : 0;

      const menuIndex = id.split("_")[1];

      const updatedMenuData = {
        ...menuData,
        active: newActiveStatus,
      };

      const itemRef = ref(database, `menuicons/${menuIndex}`);

      set(itemRef, updatedMenuData)
        .then(() => {
          console.log(`Item ${menuIndex} updated successfully.`);
        })
        .catch((error) => {
          console.error("Error updating active status:", error);
        });
    }
  });
}
