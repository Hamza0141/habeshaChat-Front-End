import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ImagePoketProvider } from "./context/ImageStore";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ImagePoketProvider>
      <DarkModeContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </DarkModeContextProvider>
    </ImagePoketProvider>
  </React.StrictMode>
);
reportWebVitals();
