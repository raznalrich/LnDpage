function showAddAnnouncement() {
  const databaseURL = "https://training-calendar-ilp05-default-rtdb.asia-southeast1.firebasedatabase.app/courses/.json";
  let container = document.getElementById('container');

  fetch(databaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        Object.values(data).forEach(menu => {
          const {
            courseName,
            startDate,
            startTime,
            endDate,
            endTime,
            keyPoints,
            maxParticipation,
            targetAudience,
            trainerName,
            mode
          } = menu;

          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <h3>${courseName}</h3>
            <p>Start Date: ${startDate}</p>
            <p>Trainer: ${trainerName}</p>
            <div class="actions">
              <i class="fas fa-trash"></i>
              <i class="fas fa-edit"></i>
            </div>
          `;

          container.appendChild(card);
        });
      } else {
        const p = document.createElement('p');
        p.innerHTML = 'No files found';
        container.appendChild(p);
      }
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

showAddAnnouncement();
