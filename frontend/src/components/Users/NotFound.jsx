import { useContext } from "react";
import { Link } from "react-router-dom";

import UIContext from "../../store/ui-context";
import classes from "./NotFound.module.css";

const NotFound = () => {
  const uiCtx = useContext(UIContext);

  const toRedirect = localStorage.getItem("role") === "admin" ? "/admin" : "/";

  return (
    <div className={`${classes["not-found"]} ${classes[uiCtx.themeClass]}`}>
      <h1>이 리소스를 찾을 수 없습니다</h1>
      <p>안타깝게도 이 리소스를 찾을 수 없습니다.</p>
      <Link
        to={toRedirect}
        className={`${classes["redirect-button"]} ${classes[uiCtx.themeClass]}`}
      >
        <button>홈으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default NotFound;
