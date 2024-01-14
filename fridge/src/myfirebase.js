// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDoc} from "firebase/firestore"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcM0dhHYeQ4ANpfNrhi_VLy8oi4Fvv5mA",
  authDomain: "myfridge-e7db9.firebaseapp.com",
  projectId: "myfridge-e7db9",
  storageBucket: "myfridge-e7db9.appspot.com",
  messagingSenderId: "1096991660515",
  appId: "1:1096991660515:web:c842bf65db290349e7e8d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function submitInfo(object) {
  try {
    const docRef = await addDoc(collection(db, "users"), object);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  alert('Submitted');
}

function initSubmit() {
  const formElems = document.querySelectorAll("form");

  if (!formElems) {return;}
  formElems.forEach((formElem) => {
    console.log(formElem);
    formElem.addEventListener("submit", (e) => {
      e.preventDefault();
      new FormData(formElem);
    });

    formElem.addEventListener("formdata", (e) => {
      const data = e.formData;
      const date = new Date().toLocaleString("en-US");
      data.append("updated-time", date);
      var object = {};
      data.forEach((value, key) => object[key] = value);
      submitInfo(object);
    });
  });
}

window.addEventListener("DOMContentLoaded", initSubmit);

