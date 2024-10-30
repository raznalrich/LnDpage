import { database, child, get, ref } from "../Firebase.js";
function getInsight() {
  let insightContent = document.getElementsByClassName("content")[0];
  const dref = ref(database);

  get(child(dref, "leaderfiles")).then((announce) => {
    announce.forEach((leaderfiles) => {
      let leaderName = leaderfiles.child("fileCat").val();
      let insightDescription = leaderfiles.child("fileDesc").val();
      let leaderImage = leaderfiles.child("fileURL").val();
      let leaderTitle = leaderfiles.child("fileTitle").val();
      console.log(leaderTitle);

      
      var item = `<div class="content">
    <div class="arrow">
     &lt;
    </div>
     <div class="profile">
     <div class="leaderImg"><img src=${leaderImage}/></div>
     <div class="info">
      <p class="name">
       ${leaderName}
      </p>
      <p class="title">
       ${leaderTitle}
      </p>
     </div>
    </div>
    <div class="divider">
    </div>
    <div class="quote">
     <p>
       ${insightDescription}
     </p>
    </div>
    <div class="arrow">
     &gt;
    </div>
   </div>
  </div>`;
         insightContent.innerHTML += item;
    });
  });
}
getInsight();
