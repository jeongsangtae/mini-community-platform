import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import NoAccess from "./NoAccess";

const Authentication = ({ children }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {authCtx.isLoggedIn ? (
        children
      ) : (
        <NoAccess
          message={{
            title: "로그인이 필요합니다",
            description: "로그인 하지 않은 사용자는 접근할 수 없습니다.",
          }}
        />
      )}
    </>
  );
};

export default Authentication;
