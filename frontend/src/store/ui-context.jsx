import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

// UIContext 생성: 초기 상태를 정의
const UIContext = React.createContext({
  themeMode: "light", // 테마 모드 (light 또는 dark)
  themeClass: "", // 테마에 따른 클래스 설정
  themeModeToggle: () => {}, // 테마 모드 토글 함수
  isMobile: false, // 모바일 환경인지 여부
  isDesktop: true, // 데스크탑 환경인지 여부
  overlayOpen: false,
  overlayOpenChcked: () => {},
  overlayCloseChcked: () => {},
});

export const UIContextProvider = ({ children }) => {
  // 모바일, 데스트탑 환경을 확인하는 react-responsive
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });

  // 테마 모드 상태를 로컬 스토리지에서 불러와 관리
  const [themeMode, setThemeMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode || "light";
  });

  const [overlayOpen, setOverlayOpen] = useState(false);

  const overlayOpenChcked = () => setOverlayOpen(true);
  const overlayCloseChcked = () => setOverlayOpen(false);

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
      value={{
        themeMode,
        themeClass,
        themeModeToggle: themeModeToggleHandler,
        isMobile,
        isDesktop,
        overlayOpen,
        overlayOpenChcked,
        overlayCloseChcked,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
