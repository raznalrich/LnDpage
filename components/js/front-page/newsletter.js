import { storage, database } from "../Firebase.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const dref = ref(getDatabase(), 'newsletter');
get(dref).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log(data[1]);
        document.getElementById('newsletter-iframe').src = data[1].htmlurl
        document.getElementById('newsletter-button').onclick = () => {
            window.location.href = data[1].htmlurl
        }
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error("Error fetching data: ", error);
});



