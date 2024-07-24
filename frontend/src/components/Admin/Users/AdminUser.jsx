import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUser.module.css";

const AdminUser = ({ email, name, onDeleteUserData }) => {
  const authCtx = useContext(AuthContext);

  const userDeleteHandler = async () => {
    const response = await fetch("http://localhost:3000/admin/user", {
      method: "DELETE",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      throw json({ message: "사용자를 삭제할 수 없습니다." }, { status: 500 });
    }
    onDeleteUserData(email);
  };

  return (
    <>
      <div className={classes["user-wrapper"]}>
        <li className={`${classes.user} ${classes[authCtx.themeClass]}`}>
          <div
            className={`${classes["info-wrap"]} ${classes[authCtx.themeClass]}`}
          >
            <p>{email}</p>
            <span>{name}</span>
          </div>
          <div
            className={`${classes["delete-button"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            <button type="button" onClick={userDeleteHandler}>
              삭제
            </button>
          </div>
        </li>
      </div>
      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
    </>
  );
};

export default AdminUser;
