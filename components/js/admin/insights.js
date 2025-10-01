import { database } from "../Firebase.js";
import { child, get, getDatabase, set, update, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

let loader = document.getElementById("loaderBg");

let previewIndex = 0;
let toggle = 0;
let buttonSection = document.getElementById("button-section");
let buttonSectionCalendar = document.getElementById("button-section-calendar");
const headerTitle = document.getElementById("header-title");

// ===== ADD NEW DATA =====
window.uploadInsight = function () {
    const courseName = document.getElementById("courseName-input").value.trim();
    const mode = document.getElementById("mode-input").value.trim();
    const startDate = document.getElementById("startDate-input").value.trim();
    const trainerName = document.getElementById("trainerName-input").value.trim();

    loader.style.display = "flex";

    if (!courseName || !mode || !startDate || !trainerName) {
        alert("Please fill all fields");
        loader.style.display = "none";
        return;
    }

    const db = database;
    const indexRef = dbRef(db, "insightIndex");

    get(indexRef).then((snapshot) => {
        let newIndex = snapshot.exists() ? parseInt(snapshot.val(), 10) + 1 : 1;

        set(indexRef, newIndex).then(() => {
            const insightsRef = dbRef(db, "insights/" + newIndex);
            set(insightsRef, {
                index: newIndex,
                courseName,
                mode,
                startDate,
                trainerName
            })
                .then(() => {
                    console.log("Insight saved successfully!");
                    discardBox();
                    loader.style.display = "none";
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error saving insight:", error);
                });
        });
    });
};

// ===== FETCH & DISPLAY =====
window.getAllFiles = function () {
    const filesRef = dbRef(getDatabase(), "insights");

    get(filesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const insightsData = snapshot.val();
                let cardContainer = document.getElementById("card-container");

                for (const fileIndex in insightsData) {
                    if (insightsData.hasOwnProperty(fileIndex)) {
                        const data = insightsData[fileIndex];

                        let card = document.createElement("div");
                        card.classList.add("card");

                        card.innerHTML = `
                            <div style="width: 100%;" class="description-container">
                                <h3>${data.courseName}</h3>
                                <p><b>Mode:</b> ${data.mode}</p>
                                <p><b>Start Date:</b> ${data.startDate}</p>
                                <p><b>Trainer:</b> ${data.trainerName}</p>
                                <div class="actions">
                                    <i class="fas fa-trash deleteButton"></i>
                                    <i class="fas fa-edit editButton" value=${fileIndex}></i>
                                </div>
                            </div>
                        `;

                        cardContainer.appendChild(card);

                        // Delete
                        const closeButton = card.querySelector(".deleteButton");
                        closeButton.addEventListener("click", function () {
                            removeInsightFromFirebase(fileIndex, card);
                        });

                        // Edit
                        const editButton = card.querySelector(".editButton");
                        editButton.addEventListener("click", function () {
                            toggle = 1;
                            previewBox(fileIndex);
                            editInsightInFirebase(data);
                            toggle = 0;
                        });
                    }
                }
            } else {
                console.log("No insights found.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving insights:", error);
        });
};

// ===== EDIT =====
window.editInsightInFirebase = function (data) {
    document.getElementById("courseName-input").value = data.courseName;
    document.getElementById("mode-input").value = data.mode;
    document.getElementById("startDate-input").value = data.startDate;
    document.getElementById("trainerName-input").value = data.trainerName;
};

// ===== UPDATE =====
function updateInsight(fileIndex, updatedData) {
    const dbRefToUpdate = dbRef(getDatabase(), "insights/" + fileIndex);

    update(dbRefToUpdate, updatedData)
        .then(() => {
            console.log("Insight updated successfully");
        })
        .catch((error) => {
            console.error("Error updating insight", error);
        });

    discardBox();
    location.reload();
}

window.updateContent = function (fileIndex) {
    let updatedData = {
        courseName: document.getElementById("courseName-input").value.trim(),
        mode: document.getElementById("mode-input").value.trim(),
        startDate: document.getElementById("startDate-input").value.trim(),
        trainerName: document.getElementById("trainerName-input").value.trim()
    };

    updateInsight(fileIndex, updatedData);
};

// ===== DELETE =====
window.removeInsightFromFirebase = function (fileIndex, card) {
    const dbRefToDelete = dbRef(getDatabase(), "insights/" + fileIndex);

    set(dbRefToDelete, null)
        .then(() => {
            console.log("Insight removed from Firebase Database");
            if (card && card.parentNode) {
                card.parentNode.removeChild(card);
            }
        })
        .catch((error) => {
            console.error("Error deleting insight from firebase", error);
        });
};

// ===== PREVIEW BOX =====
window.previewBox = function (fileIndex) {
    if (
        document.getElementById("addimage").style.display != "none" &&
        previewIndex != 1
    ) {
        document.getElementById("addimage").style.display = "none";
    } else {
        document.getElementById("addimage").style.display = "flex";
        previewIndex = 1;
    }

    if (toggle == 0) {
        buttonSection.innerHTML = `
            <button onclick="discardBox()">discard</button>
            <button onclick="uploadInsight()" id="save">save</button>
        `;
        headerTitle.innerText = "Add course details";
    } else {
        buttonSection.innerHTML = `
            <button onclick="discardBox()" id="discard-button">discard</button>
            <button onclick="updateContent(${fileIndex})" id="update">update</button>
        `;
        headerTitle.innerText = "Edit course details";
    }
};

// ===== IMAGE PREVIEW BOX =====
window.imagepreviewBox = function (fileIndex) {
    if (
        document.getElementById("addjpegcalendar").style.display != "none" &&
        previewIndex != 1
    ) {
        document.getElementById("addjpegcalendar").style.display = "none";
    } else {
        document.getElementById("addjpegcalendar").style.display = "flex";
        previewIndex = 1;
    }

    if (toggle == 0) {
        buttonSectionCalendar.innerHTML = `
            <button onclick="discardBox()">discard</button>
            <button onclick="uploadInsight()" id="save">save</button>
        `;
        headerTitle.innerText = "Add course details";
    } else {
        buttonSectionCalendar.innerHTML = `
            <button onclick="discardBox()" id="discard-button">discard</button>
            <button onclick="updateContent(${fileIndex})" id="update">update</button>
        `;
        headerTitle.innerText = "Edit course details";
    }
};

// ===== DISCARD =====
window.discardBox = function () {
    document.getElementById("addimage").style.display = "none";
    document.getElementById("addjpegcalendar").style.display = "none";
    document.getElementById("courseName-input").value = "";
    document.getElementById("mode-input").value = "";
    document.getElementById("startDate-input").value = "";
    document.getElementById("trainerName-input").value = "";
};

// === Upload or Replace Calendar Image ===
window.uploadCalendarImage = async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = sRef(storage, "calendarImage/" + file.name); // store inside "calendarImage" folder

    try {
        // Upload file
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Save URL in Realtime DB (replace existing one)
        const calendarImageRef = dbRef(database, "calendarImage");
        await set(calendarImageRef, { url: downloadURL });

        // Show preview
        const preview = document.getElementById("calendarImagePreview");
        preview.innerHTML = `<img src="${downloadURL}" style="max-width:100%; border:1px solid #ccc; border-radius:6px;" />`;

        console.log("Calendar image uploaded & URL saved:", downloadURL);
    } catch (error) {
        console.error("Error uploading calendar image:", error);
    }
};

// === Fetch & Preview Calendar Image ===
window.getCalendarImage = async function () {
    const calendarImageRef = dbRef(database, "calendarImage");

    try {
        const snapshot = await get(calendarImageRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const preview = document.getElementById("calendarImagePreview");
            preview.innerHTML = `<img src="${data.url}" style="max-width:100%; border:1px solid #ccc; border-radius:6px;" />`;
        }
    } catch (error) {
        console.error("Error fetching calendar image:", error);
    }
};

// Call this when addjpegcalendar opens
window.imagepreviewBox = function () {
    document.getElementById("addjpegcalendar").style.display = "flex";
    getCalendarImage(); // load existing image if any
};
