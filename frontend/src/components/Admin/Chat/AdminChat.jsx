import { useContext } from "react";

import UIContext from "../../../store/ui-context";
import classes from "./AdminChat.module.css";

const AdminChat = ({ message, date, userType }) => {
  const uiCtx = useContext(UIContext);

  return (
    <li
      className={`${classes["admin-chat-container"]} ${
        userType === "admin"
          ? classes["admin-message"]
          : classes["user-message"]
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

export default AdminChat;
