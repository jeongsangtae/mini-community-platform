import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/auth-context";

const Authentication = ({ children }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate("/");
    }
  }, [authCtx.isLoggedIn, navigate]);

  return <>{authCtx.isLoggedIn ? children : null}</>;
};

export default Authentication;
