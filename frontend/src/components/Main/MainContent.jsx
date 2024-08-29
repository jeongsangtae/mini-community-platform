import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./MainContent.module.css";

const MainContent = () => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  return (
    <div className={`${classes["main-content"]} ${classes[uiCtx.themeClass]}`}>
      <h1 className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </h1>
      <p className={`${classes.subtitle} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </p>
    </div>
  );
};

export default MainContent;
