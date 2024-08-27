import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./LoadingIndicator.module.css";

const LoadingIndicator = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={`${classes["lds-ring"]} ${classes[authCtx.themeClass]}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;
