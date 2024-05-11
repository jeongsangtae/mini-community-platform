import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./SignupSuccess.module.css";

const SignupSuccess = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div
      className={`${classes["signup-success"]} ${classes[authCtx.themeClass]}`}
    >
      <h1>회원가입 되었습니다.</h1>
      <p>로그인해서 여러 기능을 사용해보세요.</p>
    </div>
  );
};

export default SignupSuccess;
