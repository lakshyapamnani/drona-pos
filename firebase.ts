
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhKZFbLGq8MVmg_Ln0N4SoG6NUq_eZtk0",
  authDomain: "livin-healthy.firebaseapp.com",
  databaseURL: "https://livin-healthy-default-rtdb.firebaseio.com",
  projectId: "livin-healthy",
  storageBucket: "livin-healthy.firebasestorage.app",
  messagingSenderId: "802846930621",
  appId: "1:802846930621:web:61cd269c5dcbde277ba9d4",
  measurementId: "G-Q3JNXJSP9C"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
