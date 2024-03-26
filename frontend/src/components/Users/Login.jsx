import { useState, useContext } from "react";

import Signup from "./Signup";
import Modal from "../UI/Modal";
import classes from "./Login.module.css";
import AuthContext from "../../store/auth-context";

const Login = ({ onToggle, onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const authCtx = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
      // const resData = await response.json();
      console.log("로그인 성공");
      // console.log(resData.userInfo);
      authCtx.login();
      // authCtx.login(resData.userInfo);
      console.log(authCtx.isLoggedIn);
      onLogin(true);
      onToggle();
    }
  };

  const toggleSignupModal = () => {
    onToggle();
    setIsSignUpOpen(!isSignUpOpen);
  };

  return (
    <Modal onClose={onToggle}>
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
          <button onClick={onToggle}>취소</button>
        </div>
        {/* <Signup value="회원가입 하러가기" /> */}
        <button className={classes.signup} onClick={toggleSignupModal}>
          회원가입 하러가기
        </button>
      </form>
      {isSignUpOpen && <Signup />}
    </Modal>
  );
};

export default Login;
