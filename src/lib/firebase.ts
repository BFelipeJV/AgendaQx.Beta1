// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrPIEEpT1Y9TkH5HUtUrLzviTMmQi3D6w",
  authDomain: "surgiq-g9hlq.firebaseapp.com",
  projectId: "surgiq-g9hlq",
  storageBucket: "surgiq-g9hlq.firebasestorage.app",
  messagingSenderId: "638130076656",
  appId: "1:638130076656:web:78d36b7ddb5ec5166f3b35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }; // Export app if you need to use it elsewhere, e.g. for auth, firestore, etc.
