import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUser.module.css";

const AdminUser = ({ email, name, onDeleteUserData }) => {
  const authCtx = useContext(AuthContext);

  // 사용자를 삭제하는 함수
  const userDeleteHandler = async () => {
    // 사용자 삭제를 위한 API 요청
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

    // 부모 컴포넌트로 사용자 삭제 이벤트 전달
    onDeleteUserData(email);
  };

  return (
    <li className={classes["user-wrapper"]}>
      <div className={`${classes.user} ${classes[authCtx.themeClass]}`}>
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
      </div>
      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
    </li>
  );
};

export default AdminUser;
