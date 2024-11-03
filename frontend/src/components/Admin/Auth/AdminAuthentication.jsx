import { useContext } from "react";

import NoAccess from "../../Users/NoAccess";

import AuthContext from "../../../store/auth-context";

const AdminAuthentication = ({ children }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {authCtx.userInfo?.role === "admin" ? (
        children // 관리자 로그인으로 관리자 페이지로 이동했을 때
      ) : (
        // 비로그인 또는 관리자 로그인이 아닌 경우
        <NoAccess
          message={{
            title: "접근 권한이 없습니다.",
            description: "해당 페이지에 접근할 권한이 없습니다.",
          }}
        />
      )}
    </>
  );
};

export default AdminAuthentication;
