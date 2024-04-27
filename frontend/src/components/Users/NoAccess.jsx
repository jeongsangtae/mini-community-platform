import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./NoAccess.module.css";

const NoAccess = ({ message }) => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={`${classes["no-access"]} ${classes[authCtx.themeClass]}`}>
      <h1>{message.title}</h1>
      <p>{message.description}</p>
    </div>
  );
};

export default NoAccess;
