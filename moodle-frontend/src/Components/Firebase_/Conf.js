// import {initializeApp} from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmTWY2xrKRYM7hPK53DitRHvyjIFrTTqo",
  authDomain: "moodlelms-d76ca.firebaseapp.com",
  projectId: "moodlelms-d76ca",
  storageBucket: "moodlelms-d76ca.appspot.com",
  messagingSenderId: "885878355083",
  appId: "1:885878355083:web:112b1f124a338e0ca9d08e",
  measurementId: "G-6ERLX5YFVS",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
