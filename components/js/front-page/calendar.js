// import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
// import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
// import { database } from "../Firebase.js";

// const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";

let courses = []

function readCourses() {
    const dataRef = ref(myDb, "courses");
    set(dataRef, courses)
        .then(() => {
            console.log("Data saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
}

function showaddannouncement() {
    const dref = ref(databaseURL);
    get(child(dref, 'courses')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((menu) => {
                let value = menu.val();
                console.log(value);

                courses.push(value)
            });
            readCourses()
        } else {
            console.log("No courses found");
        }
    }).catch((error) => {
        console.error('Error fetching courses:', error);
    });
}

showaddannouncement();



// function saveFileMetadata(courseName, startDate, startTime, endDate, endTime) {
//     const db = ref(database);
//     const indexRef = ref(db, 'calendarEvents');
//     // Read the current index value and increment it
//     get(indexRef).then((snapshot) => {
//         let newIndex = 1; // Increment the index, or start at 1

//         // Save the incremented index to the database
//         set(indexRef, newIndex).then(() => {
//             const filesRef = ref(db, 'calendarEvent/' + newIndex); // Use the index as the key

//             // Save the file metadata under the indexed entry
//             set(filesRef, {
//                 courseName: courseName,
//                 startDate: startDate,
//                 startTime: startTime,
//                 endDate: endDate,
//                 endTime: endTime,
//             })
//                 .then(() => {
//                     console.log('File metadata with index saved successfully!');
//                 })
//                 .catch((error) => {
//                     console.error('Error saving file metadata:', error);
//                 });
//         });
//     });
// }