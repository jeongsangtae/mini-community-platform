import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  userInfo: null,
  isLoading: false,
  themeMode: "light",
  setIsLoading: () => {},
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
  refreshTokenExp: () => {},
  themeModeToggleHandler: () => {},
});

export const AuthContextProvier = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode || "light";
  });

  console.log(themeMode);

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
        localStorage.setItem("role", resData.role);
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
        const expirationTime = Math.ceil(now + 60 * 60);
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
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verifyUser(setUserInfo);

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
          now >= storedExpirationTime && refreshTokenExpirationTime > now
        );
        console.log(now >= refreshTokenExpirationTime);

        if (now >= storedExpirationTime && refreshTokenExpirationTime > now) {
          refreshTokenHandler();
          setIsLoggedIn(true);
        } else if (now >= refreshTokenExpirationTime) {
          logoutHandler();
        }
      };

      checkTokenExpiration();

      const interval = setInterval(checkTokenExpiration, 60 * 30 * 1000);

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
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   if (storedThemeMode) {
  //     setThemeMode(storedThemeMode);
  //   } else {
  //     setThemeMode("light");
  //     localStorage.setItem("themeMode", "light");
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // useEffect(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");

  //   setThemeMode(storedThemeMode || "light");

  //   localStorage.setItem("themeMode", themeMode);
  // }, [themeMode]);

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

  const loginHandler = async () => {
    const now = Math.floor(new Date().getTime() / 1000);
    const expirationTime = Math.ceil(now + 60 * 60);
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("expirationTime", expirationTime);
    setIsLoggedIn(true);

    await verifyUser(setUserInfo);
    // console.log(localStorage.getItem("role"));
    refreshTokenExpHandler();

    // const role = localStorage.getItem("role");
    // console.log(role);
    // if (role === "admin") {
    //   window.location.href = "/admin";
    // }
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

  const logoutHandler = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      body: JSON.stringify(),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const role = localStorage.getItem("role");
      console.log(role);
      if (role === "admin") {
        window.location.href = "/";
      }
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("refreshTokenExp");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  const userName = userInfo ? userInfo.name : "GUEST";

  const themeModeToggleHandler = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
  };

  const themeClass = themeMode === "dark" ? "dark-mode" : "";

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        setIsLoading,
        userInfo,
        userName,
        themeMode,
        themeClass,
        login: loginHandler,
        logout: logoutHandler,
        refreshToken: refreshTokenHandler,
        refreshTokenExp: refreshTokenExpHandler,
        themeModeToggle: themeModeToggleHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
