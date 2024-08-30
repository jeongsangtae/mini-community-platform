import { useContext } from "react";

import UIContext from "../../../store/ui-context";
import classes from "./AdminMainContent.module.css";

const AdminMainContent = () => {
  const uiCtx = useContext(UIContext);

  return (
    <div className={`${classes["main-content"]} ${classes[uiCtx.themeClass]}`}>
      <h1 className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </h1>
      <p className={`${classes.subtitle} ${classes[uiCtx.themeClass]}`}>
        관리자 페이지
      </p>
    </div>
  );
};

export default AdminMainContent;
