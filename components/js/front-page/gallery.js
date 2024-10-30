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
                        ul.innerHTML+=`
                        <li onclick="getFiles(event)" class='list-image'>${category}</li>
                        `
                    })
                }

        
    }).catch((err) => {
        console.error('category fetching failed',err);
    });

    
}

window.getFiles=function(e){

    let list=document.getElementsByTagName('li');
    let value=e.target.textContent;
    let imageContainer=document.getElementById('image-content');
    imageContainer.innerHTML=``;
    const filesRef = dbRef(getDatabase(), "files");
    console.log(value);
    get(filesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const filesData = snapshot.val();
        for (const fileIndex in filesData) {
            if (filesData.hasOwnProperty(fileIndex)) {
                const fileData = filesData[fileIndex];
                const fileCat = fileData.fileCat;
                const fileURL = fileData.fileURL;
                const fileName = fileData.fileName;
                if(value=='All'){
                    // console.log('entered all if else')
                    imageContainer.innerHTML+=`
                       <div class="imageCard">
                       <img src="${fileURL}" />
                       </div>
                    `
                }
                else if(fileCat==value){
                imageContainer.innerHTML+=`
                <div class="imageCard">
                <img src="${fileURL}" />
                </div>
                `}else{
                    imageContainer.remove;
                }

            }}
    }})
}