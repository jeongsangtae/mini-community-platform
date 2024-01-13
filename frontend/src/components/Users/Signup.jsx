import Modal from "../UI/Modal";
import classes from "./Signup.module.css";

const Signup = ({ toggle }) => {
  return (
    <Modal onClose={toggle}>
      <p className={classes.heading}>회원가입 페이지</p>
      <form method="post" className={classes.form}>
        <div>
          <label htmlFor="email">이메일</label>
          <input required type="email" id="email" name="email" />
        </div>

        <div>
          <label htmlFor="confirm-email">이메일 확인</label>
          <input
            required
            type="email"
            id="confirm-email"
            name="confirm-email"
          />
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
          <button onClick={toggle}>취소</button>
        </div>
        <a href="/login" className={classes.login}>
          로그인 하러가기
        </a>
      </form>
    </Modal>
  );
};

export default Signup;
