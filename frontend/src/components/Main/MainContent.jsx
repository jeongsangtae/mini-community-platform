import { useState, useContext } from "react";

import UIContext from "../../store/ui-context";
import Popup from "../UI/Popup";
import classes from "./MainContent.module.css";

const MainContent = () => {
  const uiCtx = useContext(UIContext);

  // vite에서 환경 변수 테스트
  const apiURL = import.meta.env.VITE_API_URL;

  console.log("API URL:", apiURL, import.meta.env);

  const [popupClose, setPopupClose] = useState(true);

  const popupCloseHandler = () => {
    setPopupClose(false);
  };

  return (
    <div className={`${classes["main-content"]} ${classes[uiCtx.themeClass]}`}>
      <h1 className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </h1>
      <p className={`${classes.subtitle} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </p>
      {popupClose && <Popup onClose={popupCloseHandler} />}
    </div>
  );
};

export default MainContent;
