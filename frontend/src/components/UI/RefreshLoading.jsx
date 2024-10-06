import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./RefreshLoading.module.css";

const RefreshLoading = () => {
  const uiCtx = useContext(UIContext);

  return (
    <div
      className={`${classes["refresh-loading"]} ${classes[uiCtx.themeClass]}`}
    >
      로그인 정보 확인 중<span>...</span>
    </div>
  );
};

export default RefreshLoading;
