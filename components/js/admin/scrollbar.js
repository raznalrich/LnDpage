import { storage, database ,app} from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


let addButton=document.getElementById('add-button');
window.addFile=function(){
    let fileBox=document.getElementById('addimage');
    fileBox.style.display='flex';
}

addButton.onclick=addFile();