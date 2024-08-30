import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./LoadingIndicator.module.css";

const LoadingIndicator = () => {
  const uiCtx = useContext(UIContext);

  return (
    <div className={`${classes["lds-ring"]} ${classes[uiCtx.themeClass]}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;
