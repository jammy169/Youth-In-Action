  import { initializeApp } from 'firebase/app';
  import { getFirestore } from 'firebase/firestore';

  const firebaseConfig = {
    apiKey: "AIzaSyB1mIiuRGuHjGcqj4yZFoKjSRQ1mzeXGL8",
    authDomain: "youthinaction-e1920.firebaseapp.com",
    projectId: "youthinaction-e1920",
    storageBucket: "youthinaction-e1920.firebasestorage.app",
    messagingSenderId: "976246054935",
    appId: "1:976246054935:web:2f6c7878008464316b3c52",
    measurementId: "G-XDRT01VT6R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db };
