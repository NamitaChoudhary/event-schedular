import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyA9myHEdBTSqvtsr5Ke9PzzNKqFRlyBJJM",
    authDomain: "event-schedular-35730.firebaseapp.com",
    databaseURL: "https://event-schedular-35730.firebaseio.com",
    projectId: "event-schedular-35730",
    storageBucket: "event-schedular-35730.appspot.com",
    messagingSenderId: "701304646918",
    appId: "1:701304646918:web:7b242bb3ced07a940d8287"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const db= firebase.firestore();