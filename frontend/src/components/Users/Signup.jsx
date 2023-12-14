import { Link } from "react-router-dom";

import Modal from "../UI/Modal";
import classes from "./Signup.module.css";

const Signup = () => {
  return (
    <Modal>
      <p>회원가입 페이지</p>
      <form className={classes.form}>
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
          <Link to="..">취소</Link>
        </div>
        <Link to="/login">로그인 하러가기</Link>
      </form>
    </Modal>
  );
};

export default Signup;
