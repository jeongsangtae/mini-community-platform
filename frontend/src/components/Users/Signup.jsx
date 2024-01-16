import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Modal from "../UI/Modal";
import classes from "./Signup.module.css";

const Signup = ({ toggle }) => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(signupData);

    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(true);
      setErrorMessage(errorData.message);
      return null;
    } else {
      console.log("회원가입 성공");
      toggle();
      return navigate("signup-success");
    }
  };

  return (
    <Modal onClose={toggle}>
      <p className={classes.heading}>회원가입 페이지</p>
      {error && <p>{errorMessage}</p>}
      <form className={classes.form} onSubmit={submitHandler}>
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
          <label htmlFor="username">이름</label>
          <input
            required
            type="text"
            id="username"
            name="username"
            value={signupData.username}
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
