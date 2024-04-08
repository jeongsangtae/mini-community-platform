import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  userInfo: null,
  isLoading: false,
  setIsLoading: () => {},
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
  refreshTokenExp: () => {},
});

export const AuthContextProvier = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshTokenExp, setRefreshTokenExp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(userInfo);
  console.log(refreshTokenExp);

  const verifyUser = async (setUserInfo) => {
    try {
      const response = await fetch("http://localhost:3000/accessToken", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }
      const resData = await response.json();
      if (resData) {
        console.log(resData);
        setUserInfo(resData);
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
      setUserInfo(null);
    }
  };

  const refreshTokenHandler = async () => {
    try {
      const response = await fetch("http://localhost:3000/refreshToken", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }
      const resData = await response.json();
      if (resData) {
        console.log(resData);
        const now = new Date().getTime();
        const expirationTime = now + 60 * 60 * 1000;
        localStorage.setItem("isLoggedIn", "1");
        localStorage.setItem("expirationTime", expirationTime);
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
    }
  };

  const refreshTokenExpHandler = async () => {
    try {
      const response = await fetch("http://localhost:3000/refreshTokenExp", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }
      const resData = await response.json();
      console.log(resData.tokenExp);
      if (resData) {
        console.log(resData);
        setRefreshTokenExp(resData.tokenExp);
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
      setRefreshTokenExp(null);
    }
  };

  useEffect(() => {
    verifyUser(setUserInfo);
    refreshTokenExpHandler();

    const checkTokenExpiration = () => {
      const now = new Date().getTime();
      const storedExpirationTime = localStorage.getItem("expirationTime");

      console.log(now);
      console.log(storedExpirationTime);
      console.log(refreshTokenExp);

      if (
        refreshTokenExp !== null &&
        now > storedExpirationTime &&
        refreshTokenExp > now
      ) {
        refreshTokenHandler();
        setIsLoggedIn(true);
      } else if (refreshTokenExp !== null && now > refreshTokenExp) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("expirationTime");
        setIsLoggedIn(false);
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 30 * 60 * 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // useEffect(() => {
  //   verifyUser(setUserInfo);
  //   const storedExpirationTime = localStorage.getItem("expirationTime");
  //   const now = new Date().getTime();
  //   if (now > storedExpirationTime) {
  //     localStorage.removeItem("isLoggedIn");
  //     localStorage.removeItem("expirationTime");
  //     setIsLoggedIn(false);
  //   } else {
  //     setIsLoggedIn(true);
  //   }
  //   const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
  //   if (storedUserLoggedInInformation === "1") {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const loginHandler = () => {
    const now = new Date().getTime();
    const expirationTime = now + 60 * 60 * 1000;
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("expirationTime", expirationTime);
    setIsLoggedIn(true);

    verifyUser(setUserInfo);
    refreshTokenExpHandler();

    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setUserInfo(null);
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
        isLoading,
        setIsLoading,
        userInfo,
        userName,
        login: loginHandler,
        logout: logoutHandler,
        refreshToken: refreshTokenHandler,
        refreshTokenExp: refreshTokenExpHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
