import { storage, database, app , ref } from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";



// window.getCategories=function(){
//     const fileRef = dbRef(getDatabase(), 'files');
//     console.log("entered program");

//     get(fileRef).then((snapshot) => {
//         if(snapshot.exists()){
//             const fileData=snapshot.val();
//             let categories = [];
//             for (let fileCategory in fileData) {
//                 let sampleObject=fileData[fileCategory];
//                 console.log(sampleObject)
//                 for(let cat in sampleObject){
//                     let sampleEvent=sampleObject[cat];
//                     if(cat=='fileCat'){
//                         if (!categories.includes(sampleEvent)) {
//                             categories.push(sampleEvent);
//                         }}
//                     }}
       
//                     categories.forEach((category)=>{
//                         console.log(category);
//                         const ul=document.getElementById('nav-ul');
//                         ul.innerHTML+=`
//                         <li id="${category}" onclick="getFiles(event)" class='list-image'>${category}</li>
//                         `
//                     })
//                 }

        
//     }).catch((err) => {
//         console.error('category fetching failed',err);
//     });

    
// }

async function getCategories() {
    const db = database;
  const categoriesRef = ref(db, "GalleryCategory"); // [web:3][web:9]
  try {
    const snapshot = await get(categoriesRef); // [web:2][web:3]
    const categories = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => { // iterate children to preserve keys and order [web:3]
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        categories.push({ id: key, ...data });
      });
    }
    console.log("Categories (once):", categories); // do DOM rendering instead if needed [web:3]
    categories.forEach((category) => {
                console.log(category);
                const ul=document.getElementById('nav-ul');
                ul.innerHTML+=`
                        <li id="${category.id}" onclick="getFiles(event)" class='list-image'>${category.categoryName}</li>
                        `


            });
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
}
getCategories();

window.getFiles=function(e){
    let list=document.getElementsByTagName('li');
    let elements=document.querySelectorAll('#list-elements');
    document.querySelectorAll("#list-elements").forEach(item => {
        item.classList.remove("active");
    });
    e.target.classList.color='red';
    console.log(e);
    
    let value=e.target.id;
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
                const fileDesc=fileData.fileDesc;
                if(value=='list-elemnts'){
                    // console.log('entered all if else')
                    const listItems = document.querySelectorAll('li');


                    listItems.forEach(item => {
                      item.style.backgroundColor = '';
                      item.style.color = '';
                    });
                         
                    document.getElementById('list-elemnts').style.backgroundColor='white';
                    document.getElementById('list-elemnts').style.color='red';
                    imageContainer.innerHTML+=`
                   

                    <div class="responsive">
  <div class="gallery">
    <a>
      <img src="${fileURL}" alt="Cinque Terre" onclick="openImage('${fileURL}','${fileDesc}')" >
    </a>
    <div class="desc">${fileDesc}</div>
  </div>
</div>
                       
                    `
                }
                else if(fileCat==value){
                    const listItems = document.querySelectorAll('li');


listItems.forEach(item => {
  item.style.backgroundColor = '';
  item.style.color = '';
});
                    document.getElementById(fileCat).style.backgroundColor='white';
                    document.getElementById(fileCat).style.color='red';
                imageContainer.innerHTML+=`
                                 <div class="responsive">
  <div class="gallery">
    <a>
      <img src="${fileURL}" alt="Cinque Terre" onclick="openImage('${fileURL}','${fileDesc}')" >
    </a>
    <div class="desc">${fileDesc}</div>
  </div>
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
                const fileDes=fileData.fileDesc;
                    imageContainer.innerHTML+=`
    
                                        <div class="responsive">
  <div class="gallery">
    <a>
      <img src="${fileURL}" alt="Cinque Terre" onclick="openImage('${fileURL}','${fileDes}')" >
    </a>
    <div class="desc">${fileDes}</div>
  </div>
</div>
                       
                    `
            }}
    }})
}

document.addEventListener('DOMContentLoaded',previewAllFiles);

window.openImage = function(src,caption){
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var imgsrc = document.getElementById(src);
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
modal.style.display = "block";
modalImg.src = src;
captionText.innerHTML = caption;
}

var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// let images=document.querySelectorAll('.image-content');
// window.descriptionPreview=function(e){
//     let imageContainer=document.getElementById('image-content');
//     console.log('this is a preview test again');
//     const filesRef = dbRef(getDatabase(), "files");
//     console.log(typeof(value));
//     get(filesRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const filesData = snapshot.val();
//         for (const fileIndex in filesData) {
//             if (filesData.hasOwnProperty(fileIndex)) {
//                 const fileData = filesData[fileIndex];
//                 const fileCat = fileData.fileCat;
//                 const fileURL = fileData.fileURL;
//                 const fileName = fileData.fileName;
//                 const fileDes=fileData.fileDesc;
//                     e.target.innerHTML+=`
//                        <div class="imageCard">
//                        <h3>${fileDes}</h3>
//                        </div>
//                     `

//             }}
//     }})
// }
// document.addEventListener('DOMContentLoaded',descriptionPreview);

// let images = document.querySelectorAll('.image-content');

// window.descriptionPreview = function(e) {
//     const filesRef = dbRef(getDatabase(), "files");
//     console.log('Preview triggered');

//     get(filesRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const filesData = snapshot.val();
//                 e.target.innerHTML = ''; // Clear previous content
//                 for (const fileIndex in filesData) {
//                     if (filesData.hasOwnProperty(fileIndex)) {
//                         const fileData = filesData[fileIndex];
//                         const fileDes = fileData.fileDesc;
//                         const fileURL = fileData.fileURL;
//                         e.target.innerHTML += `
//                             <div class='imageAndDesc'>
//                             <div class="imageCard" style="width: 100%; height: 100%; " onmouseenter="addDescription(event)">
//                                 <img src="${fileURL}" />
//                             </div>
//                             <div class="description" style="display:none"><h4>${fileDes}</h4></div>
//                             </div>
                            
//                         `;
//                     }
//                 }
//             } else {
//                 console.log("No data available");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching data:", error);
//         });
// };

// // Add event listeners on each image container after DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {
//     images.forEach((images) => {
//         images.addEventListener('mouseenter', descriptionPreview);
//     });
// });
// // let allImageContainers=document.querySelectorAll('.imageCard');
// document.addEventListener('DOMContentLoaded',()=>{
//     images.addEventListener('mouseenter',addDescription)
// });
// window.addDescription=function(e){
//     const filesRef = dbRef(getDatabase(), "files");
//     console.log('Preview triggered');

//     get(filesRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const filesData = snapshot.val();
//                 e.target.innerHTML = ''; // Clear previous content
//                 for (const fileIndex in filesData) {
//                     if (filesData.hasOwnProperty(fileIndex)) {
//                         const fileData = filesData[fileIndex];
//                         const fileDes = fileData.fileDesc;
//                         const fileURL = fileData.fileURL;
//                         e.target.innerHTML=`
//                         <div class='imageAndDesc'>
//                         <div class="imageCard" style="width: 100%; height: 100%; ">
//                             <img src="${fileURL}" />
//                         </div>
//                         <div class="description" style="display:flex"><h4>${fileDes}</h4></div>
//                         </div>
//     `;
//                     }
//                 }
//             } else {
//                 console.log("No data available");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching data:", error);
//         });
        
// }


window.descriptionPreview=function(e){
        
}

