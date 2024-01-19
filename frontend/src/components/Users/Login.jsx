import { useState } from "react";

import Modal from "../UI/Modal";
import classes from "./Login.module.css";

const Login = ({ toggle }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // console.log("Login Data before fetch:", loginData);

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
    });

    // console.log("Login Data after fetch:", loginData);

    if (!response.ok) {
      const errorData = await response.json();
      setError(true);
      setErrorMessage(errorData.message);
      return null;
    } else {
      console.log("로그인 성공");
      const sessionData = await response.json();
      // console.log(loginData);
      toggle(sessionData);
    }
  };

  return (
    <Modal onClose={toggle}>
      <p className={classes.heading}>로그인 페이지</p>
      {error && <p>{errorMessage}</p>}
      <form className={classes.form} onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={loginData.email}
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
            value={loginData.password}
            onChange={inputChangeHandler}
          />
        </div>

        <div className={classes.actions}>
          <button type="submit">가입</button>
          <button onClick={toggle}>취소</button>
        </div>
        <a href="/signup" className={classes.signup}>
          회원가입 하러가기
        </a>
      </form>
    </Modal>
  );
};

export default Login;
