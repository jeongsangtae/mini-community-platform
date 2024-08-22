import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUser.module.css";

const AdminUser = ({ email, name, onDeleteUserData }) => {
  const authCtx = useContext(AuthContext);

  // 사용자를 삭제하는 함수
  const userDeleteHandler = async () => {
    try {
      // 사용자 삭제를 위한 API 요청
      const response = await fetch("http://localhost:3000/admin/user", {
        method: "DELETE",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("사용자 삭제 실패");
      }

      // 부모 컴포넌트로 사용자 삭제 이벤트 전달
      onDeleteUserData(email);
    } catch (error) {
      authCtx.errorHelper(
        error,
        "사용자 삭제 중에 문제가 발생했습니다. 다시 시도해 주세요."
      );
    }
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
