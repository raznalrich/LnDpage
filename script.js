import { storage, database, app } from "../LnDpage/components/js/Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


// document.addEventListener("DOMContentLoaded", function () {
//     const section = document.getElementById("carousel");

//     // Fetch the HTML content
//     fetch("./components/pages/user/topBanner.html")
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.text();
//         })
//         .then(data => {
//             // Insert the HTML content into the section
//             section.innerHTML = data;
//         })
//         .catch(error => {
//             console.error("There was a problem with the fetch operation:", error);
//         });
// });

window.updateAnouncement=function(){
    let update=document.getElementById('badge');
    const date = new Date();
    const month = date.getMonth() + 1;
    
    if(month<10){
        month='0'+month;
        console.log(month);
    }
    console.log(typeof(month));
    const db = database;
    const indexRef = dbRef(db, 'announcement');
    let notificationCount=0;
    get(indexRef).then((result) => {
        if(result.exists()){

            let fileData=result.val();

            for(const fileIndex in fileData){
                console.log('got file',fileData);

                const fileList=fileData[fileIndex];
                let date=fileList.date;
                let sub=date.substring(5,7);
                console.log(sub);
                if(sub==month){
                    notificationCount++;
                }else{
                    console.log('not matching')
                }
                
            }
            update.textContent=notificationCount;
        }
    }).catch((err) => {
        
    });
}

document.addEventListener("DOMContentLoaded",updateAnouncement())