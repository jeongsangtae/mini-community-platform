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
  // const [refreshTokenExp, setRefreshTokenExp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        console.log(resData.tokenExp);
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
        const now = Math.floor(new Date().getTime() / 1000);
        const expirationTime = Math.ceil(now + 60 * 5);
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
        localStorage.setItem("refreshTokenExp", resData.tokenExp);
        // setRefreshTokenExp(resData.tokenExp);
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
      // setRefreshTokenExp(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verifyUser(setUserInfo);
      // refreshTokenExpHandler();

      const checkTokenExpiration = () => {
        const now = Math.floor(new Date().getTime() / 1000);
        const storedExpirationTime = parseInt(
          localStorage.getItem("expirationTime")
        );
        const refreshTokenExpirationTime = parseInt(
          localStorage.getItem("refreshTokenExp")
        );

        console.log(now);
        console.log(storedExpirationTime);
        console.log(refreshTokenExpirationTime);

        console.log(
          now > storedExpirationTime && refreshTokenExpirationTime > now
        );
        console.log(now > refreshTokenExpirationTime);

        if (now > storedExpirationTime && refreshTokenExpirationTime > now) {
          refreshTokenHandler();
          setIsLoggedIn(true);
        } else if (now > refreshTokenExpirationTime) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("expirationTime");
          localStorage.removeItem("refreshTokenExp");
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      };

      checkTokenExpiration();

      const interval = setInterval(checkTokenExpiration, 60 * 1000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [isLoggedIn]);

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
    const now = Math.floor(new Date().getTime() / 1000);
    const expirationTime = Math.ceil(now + 60 * 5);
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("expirationTime", expirationTime);
    setIsLoggedIn(true);

    verifyUser(setUserInfo);
    refreshTokenExpHandler();

    // setTimeout(() => {
    //   localStorage.removeItem("isLoggedIn");
    //   localStorage.removeItem("expirationTime");
    //   setIsLoggedIn(false);
    //   setUserInfo(null);
    // }, 60 * 5 * 1000);

    // console.log(now);
    // console.log(expirationTime);
    // console.log(new Date(now).toString());
    // console.log(new Date(expirationTime).toString());
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("refreshTokenExp");
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
