import { storage, database } from "../Firebase.js";
import {
  child,
  get,
  getDatabase,
  set,
  ref,
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

  if (!imageFile) {
    alert("Please upload an image.");
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
        })
        .catch((error) => {
          console.error("Error saving file metadata:", error);
        });
    });
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

          const img = document.createElement("img");
          img.src = value.imageUrl;
          img.alt = value.title;

          const p = document.createElement("p");
          p.textContent = value.title;

          li.appendChild(img);
          li.appendChild(p);

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
