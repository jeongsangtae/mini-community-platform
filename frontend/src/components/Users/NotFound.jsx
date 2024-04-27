import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./NotFound.module.css";

const NotFound = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={`${classes["not-found"]} ${classes[authCtx.themeClass]}`}>
      <h1>이 리소스를 찾을 수 없습니다</h1>
      <p>안타깝게도 이 리소스를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className={`${classes["redirect-button"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <button>홈으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default NotFound;
