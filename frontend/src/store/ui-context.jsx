import React, { useState, useEffect } from "react";

// UIContext 생성: 초기 상태를 정의
const UIContext = React.createContext({
  themeMode: "light", // 테마 모드 (light 또는 dark)
  themeModeToggle: () => {}, // 테마 모드 토글 함수
});

export const UIContextProvier = ({ children }) => {
  // 테마 모드 상태를 로컬 스토리지에서 불러와 관리
  const [themeMode, setThemeMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode || "light";
  });

  // 테마 모드 변경 시 로컬 스토리지에 저장하는 useEffect
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // 테마 모드 토글 함수
  const themeModeToggleHandler = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
  };

  // 테마에 따른 클래스 설정
  const themeClass = themeMode === "dark" ? "dark-mode" : "";

  return (
    <UIContext.Provider
      value={{ themeMode, themeClass, themeModeToggle: themeModeToggleHandler }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
