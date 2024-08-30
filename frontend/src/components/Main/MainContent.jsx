import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./MainContent.module.css";

const MainContent = () => {
  const uiCtx = useContext(UIContext);

  return (
    <div className={`${classes["main-content"]} ${classes[uiCtx.themeClass]}`}>
      <h1 className={`${classes.title} ${classes[uiCtx.themeClass]}`}>
        {uiCtx.isDesktop
          ? "데스크탑 미니 커뮤니티 플랫폼"
          : "모바일 미니 커뮤니티 플랫폼"}
        {/* 미니 커뮤니티 플랫폼 */}
      </h1>
      <p className={`${classes.subtitle} ${classes[uiCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </p>
    </div>
  );
};

export default MainContent;
