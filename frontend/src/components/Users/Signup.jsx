import { Link, useNavigate, Form } from "react-router-dom";

import Modal from "../UI/Modal";
import classes from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate("/posts");
  };

  return (
    <Modal>
      <p className={classes.heading}>회원가입 페이지</p>
      <Form method="post" className={classes.form}>
        <div>
          <label htmlFor="email">이메일</label>
          <input required type="text" id="email" name="email" />
        </div>

        <div>
          <label htmlFor="email-confirm">이메일 확인</label>
          <input required type="text" id="email-confirm" name="email-confirm" />
        </div>

        <div>
          <label htmlFor="name">이름</label>
          <input required type="text" id="name" name="name" />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input required type="password" id="password" name="password" />
        </div>

        <div className={classes.actions}>
          <button>가입</button>
          <button onClick={closeHandler}>취소</button>
        </div>
        <Link to="/login" className={classes.login}>
          로그인 하러가기
        </Link>
      </Form>
    </Modal>
  );
};

export default Signup;
