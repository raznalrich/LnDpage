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
                        console.log(category);
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
    let elements=document.querySelectorAll('#list-elements');
    document.querySelectorAll("#list-elements").forEach(item => {
        item.classList.remove("active");
    });
    e.target.classList.color='red';
    let value=e.target.textContent;
    let imageContainer=document.getElementById('image-content');
    imageContainer.innerHTML=``;
    const filesRef = dbRef(getDatabase(), "files");
    console.log(typeof(value));
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
                       <div class="imageCard" onmouseover="descriptionPreview(e)">
                       <img src="${fileURL}" />
                       </div>
                    `
                }
                else if(fileCat==value){
                imageContainer.innerHTML+=`
                <div class="imageCard" onmouseover="descriptionPreview(e)">
                <img src="${fileURL}" />
                </div>
                `}else{
                    imageContainer.remove;
                }

            }}
    }})
}
window.previewAllFiles=function(e){
    const filesRef = dbRef(getDatabase(), "files");
    let imageContainer=document.getElementById('image-content');
    
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
                    imageContainer.innerHTML+=`
                       <div class="imageCard">
                       <img src="${fileURL}" />
                       </div>
                    `
            }}
    }})
}

document.addEventListener('DOMContentLoaded',previewAllFiles);

window.descriptionPreview=function(e){
    let imageContainer=document.getElementById('image-content');
    console.log('this is a preview test');
    const filesRef = dbRef(getDatabase(), "files");
    console.log(typeof(value));
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
                const fileDes=fileData.fileDesc;
                    e.target.innerHTML+=`
                       <div class="descriptionCard">
                       <h3>${fileDes}</h3>
                       </div>
                    `

            }}
    }})
}