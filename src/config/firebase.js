import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDy2k-PCG-MpHPsddFysM9ZFUOMa32o_aQ",
  authDomain: "fire-storage-459.firebaseapp.com",
  projectId: "fire-storage-459",
  storageBucket: "fire-storage-459.appspot.com",
  messagingSenderId: "563602701599",
  appId: "1:563602701599:web:878f8169f714d6c04c842a",
  measurementId: "G-CPTX1QM2TN",
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const storage = firebase.storage();
