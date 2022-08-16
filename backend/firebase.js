// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmTWY2xrKRYM7hPK53DitRHvyjIFrTTqo",
    authDomain: "moodlelms-d76ca.firebaseapp.com",
    projectId: "moodlelms-d76ca",
    storageBucket: "moodlelms-d76ca.appspot.com",
    messagingSenderId: "885878355083",
    appId: "1:885878355083:web:112b1f124a338e0ca9d08e",
    measurementId: "G-6ERLX5YFVS"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app, "gs://moodlelms-d76ca.appspot.com");
// // const analytics = getAnalytics(app);
// export default storage;

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = {
    storage
}