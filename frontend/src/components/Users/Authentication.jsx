import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../pages/ErrorPage";

import AuthContext from "../../store/auth-context";

const Authentication = ({ children }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate("/*");
    }
  }, [authCtx.isLoggedIn, navigate]);

  return <>{authCtx.isLoggedIn ? children : <ErrorPage />}</>;

  // useEffect(() => {
  //   if (!authCtx.isLoggedIn) {
  //     navigate("/");
  //   }
  // }, [authCtx.isLoggedIn, navigate]);

  // return <>{authCtx.isLoggedIn ? children : <ErrorPage />}</>;

  // useEffect(() => {
  //   if (!authCtx.isLoggedIn) {
  //     navigate("/");
  //   }
  // }, [authCtx.isLoggedIn, navigate]);

  // return <>{authCtx.isLoggedIn ? children : null}</>;

  // useEffect(() => {
  //   if (!authCtx.isLoggedIn) {
  //     navigate(<ErrorPage />);
  //   }
  // }, [authCtx.isLoggedIn, navigate]);

  // return <>{authCtx.isLoggedIn ? children : null}</>;
};

export default Authentication;
