// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCH_QRJsyRv0-4Yup_WUZtwJEeV9YaG9x8',
  authDomain: 'citypedia-a2aba.firebaseapp.com',
  projectId: 'citypedia-a2aba',
  storageBucket: 'citypedia-a2aba.firebasestorage.app',
  messagingSenderId: '784427727291',
  appId: '1:784427727291:web:2a49bd4111ca54b1796c9e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
