import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import {dotenv} from "dotenv/config";
const firebaseConfig = {
  storageBucket:process.env.storageBucket,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
