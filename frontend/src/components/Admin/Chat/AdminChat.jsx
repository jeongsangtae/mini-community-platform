import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminChat.module.css";

const AdminChat = ({ message, date, userType }) => {
  const authCtx = useContext(AuthContext);

  return (
    <li
      className={`${classes["admin-chat-container"]} ${
        userType === "admin"
          ? classes["admin-message"]
          : classes["user-message"]
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

export default AdminChat;
