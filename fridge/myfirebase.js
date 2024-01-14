// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
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
const auth = getAuth(app);
onAuthStateChanged(auth, user => {
   /* check status */
    alert('check status') ;
});

function signinInfo(data) {
      console.log(data);
      signInWithEmailAndPassword(auth, data['user-email'], data.password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          alert('Hello Beomsu Nice!');
          console.log(user);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage + 'error code: ' +  errorCode);
      })
}

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
      const date = new Date().toLocaleString("en-US");
      const data = e.formData;
      let locEl   = formElem.querySelector('select.location');
      let retunEl = formElem.querySelector('select.returning');
      let loc = '';
      if ( locEl ) loc = locEl.value;
      let retun = '';
      if ( retunEl ) retun = retunEl.value;
      
      data.append("location", loc);
      data.append("new-patient", retun);
      data.append("updated-time", date);
      var object = {};
      data.forEach((value, key) => object[key] = value);
      if(document.querySelector('#auth-form')) {
        signinInfo(object);
      } else {
        submitInfo(object);
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", initSubmit);

