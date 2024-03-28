import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import NoAccess from "./NoAccess";

const Authentication = ({ children }) => {
  const authCtx = useContext(AuthContext);

  return <>{authCtx.isLoggedIn ? children : <NoAccess />}</>;
};

export default Authentication;
