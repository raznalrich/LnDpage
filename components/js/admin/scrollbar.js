import { storage, database ,app} from "../Firebase.js";
import { child, get, getDatabase, set, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL,deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


let previewIndex=0

window.previewBox = function () {
  if (document.getElementById("addimage").style.display != "none" && previewIndex!=1) {
    document.getElementById("addimage").style.display = "none"
  } else {
    document.getElementById("addimage").style.display = "flex"
    previewIndex=1;
  }
}
window.discardBox=function(){
  document.getElementById("addimage").style.display = "none"
}