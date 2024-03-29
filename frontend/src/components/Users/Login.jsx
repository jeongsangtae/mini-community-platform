import { useState, useContext } from "react";

import Modal from "../UI/Modal";
import classes from "./Login.module.css";
import AuthContext from "../../store/auth-context";

const Login = ({ onLoginToggle, onSignupToggle, onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const authCtx = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(true);
      setErrorMessage(errorData.message);
      console.log(errorData);
      return null;
    } else {
      console.log("로그인 성공");
      authCtx.login();
      console.log(authCtx.isLoggedIn);
      onLoginToggle();
    }
  };

  return (
    <Modal onClose={onLoginToggle}>
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
          <button type="submit">로그인</button>
          <button onClick={onLoginToggle}>취소</button>
        </div>
      </form>
      <button className={classes.signup} onClick={onSignupToggle}>
        회원가입 하러가기
      </button>
    </Modal>
  );
};

export default Login;
