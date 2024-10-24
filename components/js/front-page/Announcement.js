import { database, child, get, ref } from "../Firebase.js";
function getAnnouncement() {
  let announcementContainer = document.getElementsByClassName("container")[0];
  const dref = ref(database);

  get(child(dref, "announcement")).then((announce) => {
    announce.forEach((announcement) => {
      let announcementDate = announcement.child("date").val();
      let announcementDesc = announcement.child("desc").val();
      let announcementIndex = announcement.child("index").val();
      let announcementTitle = announcement.child("title").val();
      console.log(announcementDesc);

      var item = `<div class="announcement-item">
                <div class="number">${announcementIndex}</div>
                <div class="text">${announcementTitle}</div>
                <div class="date">${announcementDate}</div>
                <div class="description">
                ${announcementDesc}
                </div>
            </div>`;
      announcementContainer.innerHTML += item;
    });
  });
}
getAnnouncement();
