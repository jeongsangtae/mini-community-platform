import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUserItem.module.css";

const AdminUserItem = ({
  userId,
  name,
  email,
  lastMessage,
  lastDate,
  selectUser,
}) => {
  const authCtx = useContext(AuthContext);

  console.log(userId, name, email);

  console.log(lastMessage, lastDate);

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
        <div
          className={`${classes["user-name"]} ${classes[authCtx.themeClass]}`}
        >
          {name}
        </div>
        <div
          className={`${classes["user-email"]} ${classes[authCtx.themeClass]}`}
        >
          {email}
        </div>
        <div>{lastMessage}</div>
        <div>{lastDate}</div>
      </button>
    </li>
  );
};

export default AdminUserItem;
