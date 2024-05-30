import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminMainContent.module.css";

const AdminMainContent = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div
      className={`${classes["main-content"]} ${classes[authCtx.themeClass]}`}
    >
      <h1 className={`${classes.title} ${classes[authCtx.themeClass]}`}>
        미니 커뮤니티 플랫폼
      </h1>
      <p className={`${classes.subtitle} ${classes[authCtx.themeClass]}`}>
        관리자 페이지
      </p>
    </div>
  );
};

export default AdminMainContent;
