import { storage, database, app } from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


window.getCategories=function(){
    const fileRef = dbRef(getDatabase(), 'files');
    console.log("entered program");

    get(fileRef).then((snapshot) => {
        if(snapshot.exists()){
            const fileData=snapshot.val();
            let categories = [];
            for (let fileCategory in fileData) {
                let sampleObject=fileData[fileCategory];
                console.log(sampleObject)
                for(let cat in sampleObject){
                    let sampleEvent=sampleObject[cat];
                    if(cat=='fileCat'){
                        if (!categories.includes(sampleEvent)) {
                            categories.push(sampleEvent);
                        }}
                    }}
       
                    categories.forEach((category)=>{
                        const ul=document.getElementById('nav-ul');
                        ul.innerHTML=`
                        <li>${category}</li>
                        `
                    })
                }

        
    }).catch((err) => {
        console.error('category fetching failed',err);
    });

    
}