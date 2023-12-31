import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal";
import classes from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <Modal>
      <p className={classes.heading}>로그인 페이지</p>
      <form className={classes.form}>
        <div>
          <label htmlFor="email">이메일</label>
          <input required type="text" id="email" name="email" />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input required type="password" id="password" name="password" />
        </div>

        <div className={classes.actions}>
          <button>가입</button>
          <button onClick={closeHandler}>취소</button>
        </div>
        <Link to="/signup" className={classes.signup}>
          회원가입 하러가기
        </Link>
      </form>
    </Modal>
  );
};

export default Login;
