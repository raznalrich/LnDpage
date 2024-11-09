import { databaseCalendar, secondapp } from "../calenderAPI.js";
import { database, app1 } from "../Firebase.js";

import {
  get,
  ref,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

async function showData() {
  const events = [];
  const dbRef = ref(getDatabase(secondapp), "courses");
  const dRef = ref(getDatabase(app1), "announcement");
  try {
    const [snapshot, snapshot1] = await Promise.all([get(dbRef), get(dRef)]);
    if (snapshot.exists() || snapshot1.exists()) {
      if (snapshot.exists()) {
        snapshot.forEach((item) => {
          const data = item.val();
          console.log(data);
          events.push({
            title: data.courseName,
            start: data.startDate,
          });
        });
        if (snapshot1.exists()) {
          snapshot1.forEach((item) => {
            const data = item.val();
            console.log(data);
            events.push({
              title: data.title,
              start: data.date,
            });
          });
        }
      }
      const calendarEl = document.getElementById("calendar");
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        eventDidMount: function (info) {
          var tooltip = new Tooltip(info.el, {
            title: info.event.title,
            placement: "top",
            trigger: "hover",
            container: "body",
          });
        },
        events: events,
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