import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./Chat.module.css";

const Chat = ({ message, date, userType }) => {
  const uiCtx = useContext(UIContext);

  return (
    <li
      className={`${classes["chat-container"]} ${
        userType === "user" ? classes["user-message"] : classes["admin-message"]
      }`}
    >
      <div className={`${classes["chat-bubble"]} ${classes[uiCtx.themeClass]}`}>
        <span className={`${classes.message} ${classes[uiCtx.themeClass]}`}>
          {message}
        </span>
        <span className={classes.date}>{date}</span>
      </div>
    </li>
  );
};

export default Chat;
