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

  // 사용자 항목을 클릭했을 때 호출되는 함수
  const clickHandler = () => {
    // 선택된 사용자의 ID와 이름을 selectUser 함수로 전달
    selectUser(userId, name);
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
          <div className={classes["user-email"]}>{email}</div>
        </div>

        <div className={classes["item-right"]}>
          <div
            className={`${classes["last-message-content"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {lastMessageContent}
          </div>
          <div className={classes["last-message-date"]}>{lastMessageDate}</div>
        </div>
      </button>
    </li>
  );
};

export default AdminUserItem;
