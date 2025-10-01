import { app1 } from "../Firebase.js";
import { get, ref, getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

async function showData() {
  const events = [];
  const insightsRef = ref(getDatabase(app1), "insights");
  const announcementRef = ref(getDatabase(app1), "announcement");

  try {
    const [snapshot, snapshot1] = await Promise.all([get(insightsRef), get(announcementRef)]);

    if (snapshot.exists()) {
      const insightsData = snapshot.val();

      // If insights are an object with push keys
      Object.values(insightsData).forEach((data) => {
        console.log("Insight:", data);
        events.push({
          title: data.courseName,
          start: data.startDate,
          desc: data.desc,
          color: "#DC143C",
        });
      });

      // If insights are stored as an array (optional fallback)
      // snapshot.forEach((item) => {
      //   const data = item.val();
      //   console.log("Insight:", data);
      //   events.push({
      //     title: data.courseName,
      //     start: data.startDate,
      //     desc: data.desc,
      //     color: "#DC143C",
      //   });
      // });
    }

    if (snapshot1.exists()) {
      const announcementsData = snapshot1.val();
      Object.values(announcementsData).forEach((data) => {
        console.log("Announcement:", data);
        events.push({
          title: data.title,
          start: data.date,
          desc: data.desc,
          color: "#3F6889",
        });
      });
    }

    if (events.length > 0) {
      const calendarEl = document.getElementById("calendar");
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        eventDidMount: function (info) {
          new Tooltip(info.el, {
            title: info.event.title,
            placement: "top",
            trigger: "hover",
            container: "body",
          });
        },
        events: events, // ✅ correct
      });
      calendar.render();
    } else {
      console.log("No data found at 'insights' or 'announcement'");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

showData();
