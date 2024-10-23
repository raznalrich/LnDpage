// import { storage,database} from "../Firebase.js";
import {database,child, get,ref} from "../Firebase.js";

//   let studid = 1;
  // const dref = dbRef(db);
  
  function getAnnouncement() {
    let iconBar = document.getElementsByClassName("container")[0];
    const dref = ref(database);
  
    get(child(dref, 'announcement')).then((icons) => {
      icons.forEach(ico => {
        let Date = ico.child('date').val();
        let Desc = ico.child('desc').val();
        let Index = ico.child('index').val();
        let Title = ico.child('title').val();
        // let link = ico.child('url').val();
        console.log(Title);
        
        
            var item = `<div class="announcement-item">
                <div class="number">${Index}</div>
                <div class="text">${Title}</div>
                <div class="date">${Date}</div>
            </div>`;
            iconBar.innerHTML += item;
        
      

      });
      
    });
  }
  getAnnouncement();