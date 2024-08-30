import { useContext } from "react";

import UIContext from "../../store/ui-context";
import classes from "./SignupSuccess.module.css";

const SignupSuccess = () => {
  const uiCtx = useContext(UIContext);

  return (
    <div
      className={`${classes["signup-success"]} ${classes[uiCtx.themeClass]}`}
    >
      <h1>회원가입 되었습니다.</h1>
      <p>로그인해서 여러 기능을 사용해보세요.</p>
    </div>
  );
};

export default SignupSuccess;
