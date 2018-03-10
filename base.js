import Rebase from "re-base";
import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCJr9FX9h1AMWdTXm8KDkex4XhsJUJfpkM",
  authDomain: "care-giver-app.firebaseapp.com",
  databaseURL: "https://care-giver-app.firebaseio.com",
  projectId: "care-giver-app"
});

export default app;
