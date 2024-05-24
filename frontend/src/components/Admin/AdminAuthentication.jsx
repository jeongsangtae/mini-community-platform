import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import NoAccess from "../Users/NoAccess";

const AdminAuthentication = ({ children }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {authCtx.isLoggedIn ? (
        localStorage.getItem("role") === "admin" ? (
          children
        ) : (
          <NoAccess
            message={{
              title: "접근 권한이 없습니다",
              description: "해당 페이지에 접근할 권한이 없습니다.",
            }}
          />
        )
      ) : (
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
