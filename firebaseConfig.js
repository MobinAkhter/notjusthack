// Please firebase keep supporting v8, just until the demo :P
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8TLQEoJ0JICh5n6gXZrPHWej8YIqfSVg",
  authDomain: "localalternativesapp.firebaseapp.com",
  projectId: "localalternativesapp",
  storageBucket: "localalternativesapp.appspot.com",
  messagingSenderId: "268984448015",
  appId: "1:268984448015:web:4c38828bfb8082cd3edf7a",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();

export { db };
