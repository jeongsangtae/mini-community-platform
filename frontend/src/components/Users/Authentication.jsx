import { useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import NoAccess from "./NoAccess";

import AuthContext from "../../store/auth-context";

const Authentication = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const postData = useRouteLoaderData("post-detail");

  return (
    <>
      {authCtx.userInfo?.role === "user" ? (
        postData ? (
          postData.email === authCtx.userInfo?.email ? (
            children // 사용자 계정으로 로그인을 했고, postData가 존재하고 이메일이 일치할 때
          ) : (
            // 이메일이 일치하지 않으면 접근 권한 없음
            <NoAccess
              message={{
                title: "접근 권한이 없습니다",
                description: "해당 작업을 수행할 권한이 없습니다.",
              }}
            />
          )
        ) : (
          children // 사용자 계정으로 로그인을 했지만 postData가 존재하지 않을 때
        )
      ) : (
        // 사용자가 로그인하지 않은 경우와 관리자 로그인의 경우
        <NoAccess
          message={{
            title:
              authCtx.userInfo?.role === "admin"
                ? "사용자 전용 기능입니다."
                : "로그인이 필요합니다",
            description:
              authCtx.userInfo?.role === "admin"
                ? "관리자 계정으로는 이 기능을 사용할 수 없습니다. 사용자 계정으로 로그인해 주세요."
                : "로그인 하지 않은 사용자는 접근할 수 없습니다.",
          }}
        />
      )}
    </>
  );
};

export default Authentication;
