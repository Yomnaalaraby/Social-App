import { createContext, useEffect, useState } from "react";
import { getLoggedUserData } from "../Services/SignIn";

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);

  async function getUserData() {
    if (!token) return;

    try {
      const response = await getLoggedUserData();
      if (response?.message === 'success') {
        setUserData(response.user);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      getUserData();
    } else {
      setUserData(null);
      localStorage.removeItem('token');
    }

  }, [token]);

  return <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
    {children}
  </AuthContext.Provider>
}