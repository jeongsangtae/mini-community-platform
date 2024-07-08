import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUserItem.module.css";

const AdminUserItem = ({
  userId,
  name,
  email,
  lastMessageContent,
  lastMessageDate,
  selectUser,
}) => {
  const authCtx = useContext(AuthContext);

  const clickHandler = () => {
    selectUser(userId);
  };

  return (
    <li
      className={`${classes["item-container"]} ${classes[authCtx.themeClass]}`}
    >
      <button
        onClick={clickHandler}
        className={`${classes["item-select-button"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <div className={classes["item-left"]}>
          <div
            className={`${classes["user-name"]} ${classes[authCtx.themeClass]}`}
          >
            {name}
          </div>
          <div
            className={`${classes["user-email"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {email}
          </div>
        </div>
        <div className={classes["item-right"]}>
          <div
            className={`${classes["last-message-content"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {lastMessageContent}
          </div>
          <div
            className={`${classes["last-message-date"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {lastMessageDate}
          </div>
        </div>
      </button>
    </li>
  );
};

export default AdminUserItem;
