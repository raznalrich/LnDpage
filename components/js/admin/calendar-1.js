import { database, secondapp } from "../calenderAPI.js";
import { child, get, ref, getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

async function showData() {
    const events = [];
    const dbRef = ref(getDatabase(secondapp), 'courses');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            snapshot.forEach((item) => {
                const data = item.val();
                events.push({
                    title: data.courseName,
                    start: data.startDate
                });
            });
            console.log(events);
            // Initialize the calendar with fetched events
            const calendarEl = document.getElementById('calendar');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: events
            });
            calendar.render();
        } else {
            console.log("No data found at 'courses' path.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

showData();


// let events = [];
// const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";

// async function calenderView() {
//     await fetch(databaseURL)
//         .then(response => response.json())
//         .then(data => {
//             Object.keys(data).forEach(key => {
//                 events.push({ title: data[key].courseName, start: data[key].startDate})
//             });

//             console.log(events)
//         })
//         .catch(error => {
//             console.error("Error fetching data:", error);
//         });

//     var calendarEl = document.getElementById('calendar');
//     var calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: 'dayGridMonth',
//         events: events
//     });
//     calendar.render();
// }

// calenderView()