import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./NoAccess.module.css";

const NoAccess = ({ message }) => {
  const uiCtx = useContext(UIContext);

  return (
    <div className={`${classes["no-access"]} ${classes[uiCtx.themeClass]}`}>
      <h1>{message.title}</h1>
      <p>{message.description}</p>
    </div>
  );
};

export default NoAccess;
