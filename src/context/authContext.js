import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [err, setErr] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (input) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}auth/login`,
        input,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCurrentUser(response.data);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.log(error.response.data);
      setErr(error.response.data);
      throw error.response.data;
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, err }}>
      {children}
    </AuthContext.Provider>
  );
};
