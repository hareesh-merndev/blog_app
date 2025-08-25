import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEvn } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaJS_5zSwXFmAJd_Otw5ck-JaWNOuQAiU",
  authDomain: "blog-96b2a.firebaseapp.com",
  projectId: "blog-96b2a",
  storageBucket: "blog-96b2a.firebasestorage.app",
  messagingSenderId: "604149019588",
  appId: "1:604149019588:web:8c9b379017c828d0f66a91",
  measurementId: "G-T7EVHLSC0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }