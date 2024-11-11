import React, { useState, useEffect } from "react";
import classes from "./Popup.module.css";

const Popup = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const popupClosed = sessionStorage.getItem("popupClosed");

    if (!popupClosed) {
      setPopupVisible(true);
    }
  }, []);

  const popupCloseHandler = () => {
    sessionStorage.setItem("popupClosed", "true");
    setPopupVisible(false);
  };

  if (!popupVisible) return null;

  return (
    <div className={classes.popup}>
      <h2 className={classes["popup-title"]}>관리자 페이지 계정 안내</h2>
      <div className={classes["popup-content"]}>
        <p>관리자 페이지 테스트를 위한 계정 안내</p>
        <p>아이디: admin@admin.com</p>
        <p>비밀번호: </p>
      </div>
      <div className={classes["popup-footer"]}>
        <p>브라우저 종료 시 다시 표시됨</p>
        <button onClick={popupCloseHandler}>닫기</button>
      </div>
    </div>
  );
};

export default Popup;
