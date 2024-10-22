  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { child, get, getDatabase, set,ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
 
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBeKLONogJ4ZNis_2nSemRg-Cq5aeZbwwI",
    authDomain: "lndvconnect-6f4ac.firebaseapp.com",
    projectId: "lndvconnect-6f4ac",
    storageBucket: "lndvconnect-6f4ac.appspot.com",
    messagingSenderId: "975204454619",
    appId: "1:975204454619:web:1d8429bc1b6319d424fcfe",
    measurementId: "G-CGDP9XCH1G"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const storage = getStorage(app);
  const database = getDatabase(app);
  export {storage,database,child, get,ref}
  
  const db = getDatabase();
  let studid = 1;

  
  function getStudent() {
    let iconBar = document.getElementsByClassName("icon-bar")[0];
    const dref = ref(db);
  
    get(child(dref, '/menuicons')).then((icons) => {
      icons.forEach(ico => {
        let isActive = ico.child('active').val();
        let imageUrl = ico.child('imageURL').val();
        let title = ico.child('title').val();
        let link = ico.child('url').val();
  
        if (isActive) { // Check if icon is active
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
  getStudent();