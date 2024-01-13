import { useState } from "react";

import Modal from "../UI/Modal";
import classes from "./Signup.module.css";

const Signup = ({ toggle }) => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    console.log(signupData);

    setSignupData({
      name: "",
      email: "",
      confirmEmail: "",
      password: "",
    });

    // const response = fetch("http://localhost:3000/signup", {
    //   method: "POST",
    //   body: JSON.stringify(signData),
    //   headers: {"Content-Type": "application/json"}
    // })
  };

  return (
    <Modal onClose={toggle}>
      <p className={classes.heading}>회원가입 페이지</p>
      <form method="post" className={classes.form} onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={signupData.email}
            onChange={inputChangeHandler}
          />
        </div>

        <div>
          <label htmlFor="confirm-email">이메일 확인</label>
          <input
            required
            type="email"
            id="confirm-email"
            name="confirmEmail"
            value={signupData.confirmEmail}
            onChange={inputChangeHandler}
          />
        </div>

        <div>
          <label htmlFor="name">이름</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={signupData.name}
            onChange={inputChangeHandler}
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            required
            type="password"
            id="password"
            name="password"
            value={signupData.password}
            onChange={inputChangeHandler}
          />
        </div>

        <div className={classes.actions}>
          <button type="submit">가입</button>
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
