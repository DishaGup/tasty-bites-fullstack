import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    // Check if the admin is already logged in using browser storage
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setAuth(adminLoggedIn);
  }, []);

  const loginUser = () => {
    setAuth(true);
    // Store the admin login status in browser storage
    localStorage.setItem('adminLoggedIn', 'true');
    
  };

  const logoutUser = () => {
    setAuth(false);
    // Clear the stored admin login status from browser storage
   // logoutUser()
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem("token")
  };

const gettokenofheader="Admin-power"

  return (
    <AuthContext.Provider value={{ isAuth, loginUser, logoutUser,gettokenofheader }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
