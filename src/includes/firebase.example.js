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
  doc,
  query, 
  where, 
  getDocs,
  updateDoc, 
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { 
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
const storage = getStorage(app);

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
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  deleteObject,
  getDoc,
}