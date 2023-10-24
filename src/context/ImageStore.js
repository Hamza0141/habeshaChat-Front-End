import { createContext,useState, useEffect } from "react";
import {
  ref,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../firebase";
import React from 'react'


export const ImagePoket = createContext();
export const ImagePoketProvider = ({ children }) => {


    const [imageUrls, setImageUrls] = useState([]);
    const imagesListRef = ref(storage, "image/");

    useEffect(() => {
      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls((prev) => [...prev, url]);
          });
        });
      });
    }, []);
           const getImageUrl = (img) => {
             if (img == null) return;
             // Extract the image name from the URL (portion after "image%2F")
             const urlParts = img.split("/");
             const imageNameFromUrl = urlParts[urlParts.length - 1];

             // Find the URL that matches the extracted image name
             const imageUrl = imageUrls.find((url) =>
               url.includes(imageNameFromUrl)
             );

             return imageUrl || ""; // Return the found URL or an empty string if not found
           };

    return (
      <ImagePoket.Provider value={{ getImageUrl }}>
        {children}
      </ImagePoket.Provider>
    );

};


