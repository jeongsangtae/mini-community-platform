import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  // userData: null,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvier = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedExpirationTime = localStorage.getItem("expirationTime");
    const now = new Date().getTime();

    if (now > storedExpirationTime) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("expirationTime");
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = () => {
    const now = new Date().getTime();
    const expirationTime = now + 60 * 60 * 1000;
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("expirationTime", expirationTime);
    setIsLoggedIn(true);
    // setUserData(userData);

    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    }, 60 * 60 * 1000);

    console.log(now);
    console.log(expirationTime);
    console.log(new Date(now).toString());
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("expirationTime");
    setIsLoggedIn(false);
    // setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        // userData: userData,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
