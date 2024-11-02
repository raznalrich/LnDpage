import { database, secondapp } from "../calenderAPI.js";
import { child, get, getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

function showData() {
    const dbRef = ref(database)

    get(child(dbRef, 'courses')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((item) => {
                let value = item.val()
                // console.log(value)
            })
        }
    })
}

showData()