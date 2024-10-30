let events = [];
const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";

async function calenderView() {
    await fetch(databaseURL)
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                events.push({ title: data[key].courseName, start: data[key].startDate})
            });

            console.log(events)
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events
    });
    calendar.render();
}

calenderView()