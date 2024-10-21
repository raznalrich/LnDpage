import { storage, database ,app} from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

let imageCategory=document.getElementById('image-category');
console.log('entered before function')
window.getAllCategory = function () {
    console.log("entered inside getAllCategory");

    const fileRef = dbRef(getDatabase(), 'files');
    console.log("entered program");

    get(fileRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("entered database");

            const fileData = snapshot.val();
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
                    }
                    
        
                
            }

            // Render categories to the DOM
            categories.forEach((category) => {
                let categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-div';
                categoryDiv.innerText = category;
                categoryDiv.style.width='20%'
                categoryDiv.style.height='10%';
                categoryDiv.style.background='#D9D9D9'
                categoryDiv.style.margin='2%'

                // Append the categoryDiv to the imageCategory container
                imageCategory.appendChild(categoryDiv);
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error getting data:", error);
    });
}

// Correctly attach the event listener, passing the function reference
window.addEventListener('DOMContentLoaded', getAllCategory);