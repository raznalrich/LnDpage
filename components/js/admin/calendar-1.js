import { database, secondapp } from "../calenderAPI.js";
import {
  child,
  get,
  ref,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

async function showData() {
  const events = [];
  const dbRef = ref(getDatabase(secondapp), "courses");
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      snapshot.forEach((item) => {
      
        const data = item.val();
        console.log(data)
        events.push({
          title: data.courseName,
          start: data.startDate,
          mode: data.mode
        });
      });
      console.log(events);
      // Initialize the calendar with fetched events
      const calendarEl = document.getElementById("calendar");
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        eventDidMount: function(info) {
          var tooltip = new Tooltip(info.el, {
            title: info.event.title,
            placement: 'top',
            trigger: 'hover',
            container: 'body'
          });
        },
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