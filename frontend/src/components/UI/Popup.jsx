import React, { useState, useEffect, useContext } from "react";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Popup.module.css";

const Popup = () => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const apiURL = import.meta.env.VITE_API_URL;

  const [popupVisible, setPopupVisible] = useState(false);
  const [popup, setPopup] = useState();

  console.log(popup);

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        const response = await fetch(`${apiURL}/popup`);

        if (!response.ok) {
          throw new Error("팝업 조회 실패");
        }

        const resData = await response.json();

        setPopup(resData.popup);

        if (resData.popup?.active && !sessionStorage.getItem("popupClosed")) {
          setPopupVisible(true);
        }
      } catch (error) {
        authCtx.errorHelper(
          error,
          "팝업을 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
    };

    fetchPopupData();
  }, []);

  const popupCloseHandler = () => {
    sessionStorage.setItem("popupClosed", "true");
    setPopupVisible(false);
  };

  if (!popupVisible) return null;

  return (
    <div className={`${classes.popup} ${classes[uiCtx.themeClass]}`}>
      <h2 className={`${classes["popup-title"]} ${classes[uiCtx.themeClass]}`}>
        {popup?.title}
      </h2>
      <div
        className={`${classes["popup-content"]} ${classes[uiCtx.themeClass]}`}
      >
        <p>{popup?.content}</p>
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
