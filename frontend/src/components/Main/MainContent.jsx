import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./MainContent.module.css";

const MainContent = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div
      className={`${classes["main-content"]} ${classes[authCtx.themeClass]}`}
    >
      <h1 className={`${classes.title} ${classes[authCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </h1>
      <p className={`${classes.subtitle} ${classes[authCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </p>
    </div>
  );
};

export default MainContent;
