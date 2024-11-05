import { database, child, get, ref } from "../Firebase.js";

function getAnnouncement() {
  let announcementContainer = document.getElementsByClassName("container")[0];
  const dref = ref(database);

  get(child(dref, "announcement")).then((announce) => {
    let announcementsArray = [];
    announce.forEach((announcement) => {
      let announcementDate = announcement.child("date").val();
      let announcementDesc = announcement.child("desc").val();
      let announcementTitle = announcement.child("title").val();
      let announcementUrl = announcement.child("url").val();

      announcementsArray.push({
        date: new Date(announcementDate),
        title: announcementTitle,
        desc: announcementDesc,
        url: announcementUrl, 
      });
    });

    announcementsArray.sort((a, b) => a.date - b.date);
    const limitedAnnouncements = announcementsArray.slice(0, 3);
    
    limitedAnnouncements.forEach((announcement, index) => {
      let item = announcement.url 
        ? `<a href="${announcement.url}" target="_blank" class="announcement-item-link">`
        : "";
      item += `<div class="announcement-item">
                  <div class="number">${index + 1}</div>
                  <div class="text">${announcement.title}</div>
                  <div class="date">${announcement.date.toLocaleDateString()}</div>
                  <div class="description">${announcement.desc}</div>
               </div>`;
      item += announcement.url ? `</a>` : "";

      announcementContainer.innerHTML += item;
    });
  });
}
getAnnouncement();
