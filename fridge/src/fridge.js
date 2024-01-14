import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs} from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyAcM0dhHYeQ4ANpfNrhi_VLy8oi4Fvv5mA",
    authDomain: "myfridge-e7db9.firebaseapp.com",
    projectId: "myfridge-e7db9",
    storageBucket: "myfridge-e7db9.appspot.com",
    messagingSenderId: "1096991660515",
    appId: "1:1096991660515:web:c842bf65db290349e7e8d6"
  };

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// function appendLi(parent, itemData, check, text) {
//     const liClone = document.querySelector('#list-element').content.cloneNode(true);
//     if ( itemData[check] ) {
//         liClone.querySelector('li').textContent = text;
//         parent.appendChild(liClone);
//     }
// }

function displayItem(item) {
    const itemData = item.data()
    const foodsE = document.querySelector('#foods');
    // CreateElement
    if (foodsE && "content" in document.createElement("template")) {
        const template = document.querySelector("#food-template");
        // Clone
        const clone = template.content.cloneNode(true);
        clone.querySelector('.update-time').textContent = itemData["updated-time"];
        clone.querySelector('.food-location').textContent = itemData.location;
        clone.querySelector('.food-name').textContent = itemData.name;
        clone.querySelector('.food-amount').textContent = itemData.quantity;
        clone.querySelector('.from').textContent = itemData.from;
        clone.querySelector('.to').textContent = itemData.to;
        // clone.querySelector('.story').textContent = itemData.story;
        foodsE.appendChild(clone);
    }
}

function display_items(data) {
    data.forEach(displayItem);
}

async function init() {
    let data = await getDocs(collection(db, "users"));
    display_items(data);
}

window.addEventListener("DOMContentLoaded", init);
