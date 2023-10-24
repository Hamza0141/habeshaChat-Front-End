import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import {dotenv} from "dotenv/config";
const firebaseConfig = {
  storageBucket:"habeshachat-5a1bf.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
