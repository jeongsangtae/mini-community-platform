import React, { useState, useEffect, useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./Popup.module.css";

const Popup = () => {
  const uiCtx = useContext(UIContext);

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
    <div className={`${classes.popup} ${classes[uiCtx.themeClass]}`}>
      <h2 className={`${classes["popup-title"]} ${classes[uiCtx.themeClass]}`}>
        관리자 페이지 계정 안내
      </h2>
      <div
        className={`${classes["popup-content"]} ${classes[uiCtx.themeClass]}`}
      >
        <p>
          관리자 페이지 테스트를 위한 계정 안내 <br />
          아이디: admin@admin.com <br />
          비밀번호:
        </p>
      </div>
      <div
        className={`${classes["popup-footer"]} ${classes[uiCtx.themeClass]}`}
      >
        <p>브라우저 종료 시 다시 표시됨</p>
        <button onClick={popupCloseHandler}>닫기</button>
      </div>
    </div>
  );
};

export default Popup;
