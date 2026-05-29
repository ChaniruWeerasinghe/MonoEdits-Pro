import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBWD_E-coJ_fLo5cPFAAogJaamHve1GoPQ",
  authDomain: "monoedits-pro.firebaseapp.com",
  projectId: "monoedits-pro",
  storageBucket: "monoedits-pro.firebasestorage.app",
  messagingSenderId: "827062251218",
  appId: "1:827062251218:web:63206e9a0ef4783a32070b"
};

const app = initializeApp(firebaseConfig);

export default app;
