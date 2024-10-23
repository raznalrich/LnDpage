document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
    });

    calendar.render();
});

fetch('https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app')
    .then(response => response.json())
    .then(data => displayEvents(data))
    .catch(error => console.error('Error fetching the users: ', error))