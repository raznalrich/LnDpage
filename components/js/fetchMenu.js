// import { storage,database} from "../Firebase.js";
import {storage,database,child, get,ref,app} from "./Firebase.js";

  let studid = 1;
  // const dref = dbRef(db);
  
  function getTiles() {
    let iconBar = document.getElementsByClassName("icon-bar")[0];
    const dref = ref(database);
  
    get(child(dref, 'menuicons')).then((icons) => {
      icons.forEach(ico => {
        let isActive = ico.child('active').val();
        let imageUrl = ico.child('imageUrl').val();
        let title = ico.child('title').val();
        let link = ico.child('url').val();
        console.log(imageUrl);
        
  
        if (isActive) { 
          var item = `<div class="icon-item">
            <a href="${link}">
              <img src='${imageUrl}'/>
            </a>
            <p>${title}</p>
          </div>`;
          iconBar.innerHTML += item;
        }
      });
      
    });
  }
  getTiles();