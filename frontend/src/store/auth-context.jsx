import React, { useState, useEffect } from "react";

// AuthContext 생성: 초기 상태를 정의
const AuthContext = React.createContext({
  isLoggedIn: false, // 로그인 여부를 나타냄
  userInfo: null, // 사용자 정보
  userName: "",
  isLoading: false, // 로딩 상태
  // themeMode: "light", // 테마 모드 (light 또는 dark)
  setIsLoading: () => {}, // 로딩 상태를 설정하는 함수
  login: () => {}, // 로그인 함수
  logout: () => {}, // 로그아웃 함수
  refreshToken: () => {}, // 토큰 갱신 함수
  refreshTokenExp: () => {}, // 리프레쉬 토큰 만료 시간 갱신 함수
  // themeModeToggle: () => {}, // 테마 모드 토글 함수
  errorHelper: () => {}, // 예외 처리의 에러를 처리하는 헬퍼 함수
});

// AuthContextProvider 컴포넌트: 인증 및 테마 관련 상태와 함수들을 제공
export const AuthContextProvider = ({ children }) => {
  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 테마 모드 상태를 로컬 스토리지에서 불러와 관리
  // const [themeMode, setThemeMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode || "light";
  // });

  // 사용자가 로그인된 상태인지 확인하는 함수
  const verifyUser = async (setUserInfo) => {
    try {
      const response = await fetch(`${apiURL}/accessToken`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }

      const resData = await response.json();

      if (resData) {
        setUserInfo(resData); // 사용자 정보를 상태로 설정
        localStorage.setItem("role", resData.role); // 사용자 역할 저장
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
      setUserInfo(null);
    }
  };

  // 토큰을 갱신하는 함수
  const refreshTokenHandler = async () => {
    try {
      const response = await fetch(`${apiURL}/refreshToken`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }

      const resData = await response.json();

      if (resData) {
        const now = Math.floor(new Date().getTime() / 1000);
        // const expirationTime = Math.ceil(now + 60 * 60); // 1시간 유효
        const expirationTime = Math.ceil(now + 30 * 60);
        localStorage.setItem("isLoggedIn", "1");
        localStorage.setItem("expirationTime", expirationTime); // 만료 시간 저장
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
    }
  };

  // 리프레시 토큰 만료 시간을 갱신하는 함수
  const refreshTokenExpHandler = async () => {
    try {
      const response = await fetch(`${apiURL}/refreshTokenExp`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("쿠키에 JWT 토큰 없음");
      }

      const resData = await response.json();

      if (resData) {
        localStorage.setItem("refreshTokenExp", resData.tokenExp); // 토큰 만료 시간 저장
      }
    } catch (error) {
      console.error("사용자 인증 오류", error);
    }
  };

  // 로그인 여부에 따라 사용자 인증 및 토큰 갱신을 확인하는 useEffect
  useEffect(() => {
    if (isLoggedIn) {
      try {
        verifyUser(setUserInfo);

        // 토큰 만료를 확인하고 필요 시 갱신하는 함수
        const checkTokenExpiration = () => {
          const now = Math.floor(new Date().getTime() / 1000);
          const storedExpirationTime = parseInt(
            localStorage.getItem("expirationTime")
          );
          const refreshTokenExpirationTime = parseInt(
            localStorage.getItem("refreshTokenExp")
          );

          console.log(now);
          console.log(
            "현재 시간:",
            `${date.getFullYear()}.${
              date.getMonth() + 1
            }.${date.getDate()} ${date
              .getHours()
              .toString()
              .padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`
          );
          console.log(storedExpirationTime);
          console.log(refreshTokenExpirationTime);

          console.log(
            now >= storedExpirationTime && refreshTokenExpirationTime > now
          );
          console.log(now >= refreshTokenExpirationTime);

          if (now >= storedExpirationTime && refreshTokenExpirationTime > now) {
            refreshTokenHandler();
            setIsLoggedIn(true); // 토큰 갱신 후 로그인 상태 유지
          } else if (now >= refreshTokenExpirationTime) {
            logoutHandler(); // 리프레시 토큰 만료 시 로그아웃
          }
        };

        checkTokenExpiration(); // 초기 확인

        // 일정 시간마다 토큰 만료 확인
        // const interval = setInterval(checkTokenExpiration, 60 * 30 * 1000);
        const interval = setInterval(checkTokenExpiration, 60 * 15 * 1000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
      } catch (error) {
        console.error("오류 발생:", error);
        logoutHandler(); // 오류 발생 시 로그아웃
      }
    }
  }, [isLoggedIn]);

  // 앱이 처음 로드될 때 로그인 상태 확인하는 useEffect
  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태를 불러옴
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  // 테마 모드 변경 시 로컬 스토리지에 저장하는 useEffect
  // useEffect(() => {
  //   localStorage.setItem("themeMode", themeMode);
  // }, [themeMode]);

  // 로그인 처리 함수
  const loginHandler = async () => {
    try {
      const now = Math.floor(new Date().getTime() / 1000);
      // const expirationTime = Math.ceil(now + 60 * 60);
      const expirationTime = Math.ceil(now + 60 * 30);

      localStorage.setItem("isLoggedIn", "1");
      localStorage.setItem("expirationTime", expirationTime);

      setIsLoggedIn(true);

      await verifyUser(setUserInfo); // 사용자 정보 확인

      refreshTokenExpHandler(); // 리프레시 토큰 만료 시간 갱신
    } catch (error) {
      // 예외 발생 시 로그인 상태 해제 및 오류 메시지 표시
      setIsLoggedIn(false);
      errorHelperHandler(
        error,
        "로그인 과정에서 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  // 로그아웃 처리 함수
  const logoutHandler = async () => {
    try {
      const response = await fetch(`${apiURL}/logout`, {
        method: "POST",
        body: JSON.stringify(),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      const role = localStorage.getItem("role");

      if (role === "admin") {
        window.location.href = "/"; // 관리자 로그아웃 시 홈으로 이동
      }

      // 로컬 스토리지 초기화 내용
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("refreshTokenExp");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      errorHelperHandler(
        error,
        "네트워크 문제로 로그아웃에 실패했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  // Fetch 함수 내에서 발생한 에러를 처리하고 재사용할 수 있는 헬퍼 함수
  const errorHelperHandler = (error, errorMessage) => {
    console.error("에러 내용:", error.message);
    alert(errorMessage);
  };

  // 사용자 이름 설정
  const userName = userInfo ? userInfo.name : "GUEST";

  // 테마 모드 토글 함수
  // const themeModeToggleHandler = () => {
  //   const newThemeMode = themeMode === "light" ? "dark" : "light";
  //   setThemeMode(newThemeMode);
  // };

  // 테마에 따른 클래스 설정
  // const themeClass = themeMode === "dark" ? "dark-mode" : "";

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        setIsLoading,
        userInfo,
        userName,
        // themeMode,
        // themeClass,
        login: loginHandler,
        logout: logoutHandler,
        refreshToken: refreshTokenHandler,
        refreshTokenExp: refreshTokenExpHandler,
        // themeModeToggle: themeModeToggleHandler,
        errorHelper: errorHelperHandler,
      }}
    >
      {children} {/* AuthContext를 사용하는 컴포넌트들이 children으로 전달됨 */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
