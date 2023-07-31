import { initializeApp  } from 'firebase/app';
// import firebase from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut ,
} from "firebase/auth";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc, 
  doc 
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  // getAuth,
  createUserWithEmailAndPassword,
  db,
  collection,
  addDoc,
  setDoc,
  auth,
  doc,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
}