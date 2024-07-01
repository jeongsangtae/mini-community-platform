import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./Chat.module.css";

const Chat = ({ message, date, userType }) => {
  const authCtx = useContext(AuthContext);

  return (
    <li
      className={`${classes["chat-container"]} ${
        userType === "user" ? classes["user-message"] : classes["admin-message"]
      }`}
    >
      <div
        className={`${classes["chat-bubble"]} ${classes[authCtx.themeClass]}`}
      >
        <span className={`${classes.message} ${classes[authCtx.themeClass]}`}>
          {message}
        </span>
        <span className={classes.date}>{date}</span>
      </div>
    </li>
  );
};

export default Chat;
