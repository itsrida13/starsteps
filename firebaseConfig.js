

// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUGrlPBVIy6CKd8vNjIyjvOhBZil2emos",
  authDomain: "star-steps-99e89.firebaseapp.com",
  projectId: "star-steps-99e89",
  storageBucket: "star-steps-99e89.appspot.com",
  messagingSenderId: "136279380453",
  appId: "1:136279380453:web:c8ab09400dbb9010ba5f0c",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
