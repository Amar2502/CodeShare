// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy0Amk9pOoBlknVN6D2LBhRed3Y-lmSbs",
  authDomain: "web-based-code-editor-642f7.firebaseapp.com",
  databaseURL: "https://web-based-code-editor-642f7-default-rtdb.firebaseio.com",
  projectId: "web-based-code-editor-642f7",
  storageBucket: "web-based-code-editor-642f7.firebasestorage.app",
  messagingSenderId: "276405439692",
  appId: "1:276405439692:web:53cd6fc24d158494588669"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);