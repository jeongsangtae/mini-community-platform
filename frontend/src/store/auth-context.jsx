import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  userInfo: null,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvier = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  console.log(userInfo);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/accessToken", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("쿠키에 JWT 토큰 없음");
        }
        const resData = await response.json();
        console.log(resData);
        if (resData) {
          console.log(resData);
          setUserInfo(resData);
        }
      } catch (error) {
        console.error("사용자 인증 오류", error);
        setUserInfo(null);
      }
    };

    verifyUser();

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
    // setUserInfo(userInfoData);

    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    }, 60 * 60 * 1000);

    // console.log(now);
    // console.log(expirationTime);
    // console.log(new Date(now).toString());
    // console.log(new Date(expirationTime).toString());
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("expirationTime");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const userName = userInfo ? userInfo.name : "GUEST";

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        userName,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
