import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminUser.module.css";

const AdminUser = ({ email, name, onDeleteUserData }) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  // 사용자를 삭제하는 함수
  const userDeleteHandler = async () => {
    try {
      // 사용자 삭제를 위한 API 요청
      const response = await fetch(`${apiURL}/admin/users`, {
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
        "사용자 삭제 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <li className={classes["user-wrapper"]}>
      <div className={`${classes.user} ${classes[uiCtx.themeClass]}`}>
        <div className={`${classes["info-wrap"]} ${classes[uiCtx.themeClass]}`}>
          <p>{email}</p>
          <span>{name}</span>
        </div>
        <div
          className={`${classes["delete-button"]} ${classes[uiCtx.themeClass]}`}
        >
          <button type="button" onClick={userDeleteHandler}>
            삭제
          </button>
        </div>
      </div>
      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>
    </li>
  );
};

export default AdminUser;
