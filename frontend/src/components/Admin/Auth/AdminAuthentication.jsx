import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import NoAccess from "../../Users/NoAccess";

const AdminAuthentication = ({ children }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {authCtx.isLoggedIn ? (
        localStorage.getItem("role") === "admin" ? (
          children // 로그인을 했고, 로컬 스토리지에 저장된 role 항목이 admin일 때
        ) : (
          // 로컬 스토리지에 저장된 role 항목이 user일 경우 접근 권한 없음
          <NoAccess
            message={{
              title: "접근 권한이 없습니다",
              description: "해당 페이지에 접근할 권한이 없습니다.",
            }}
          />
        )
      ) : (
        // 사용자가 로그인하지 않은 경우
        <NoAccess
          message={{
            title: "로그인이 필요합니다",
            description: "로그인 하지 않은 관리자는 접근할 수 없습니다.",
          }}
        />
      )}
    </>
  );
};

export default AdminAuthentication;
