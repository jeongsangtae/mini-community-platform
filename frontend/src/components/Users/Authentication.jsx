import { useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import NoAccess from "./NoAccess";

const Authentication = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const postData = useRouteLoaderData("post-detail");

  let content;

  if (authCtx.isLoggedIn) {
    content = children;
  } else {
    content = <NoAccess checkWriter={authCtx.isLoggedIn} />;
  }

  if (authCtx.isLoggedIn && postData.email === authCtx.userInfo?.email) {
    content = children;
  } else {
    content = <NoAccess checkWriter={authCtx.isLoggedIn} />;
  }

  return <>{content}</>;
};

export default Authentication;
