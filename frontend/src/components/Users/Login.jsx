import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

import Modal from "../UI/Modal";
import classes from "./Login.module.css";
import AuthContext from "../../store/auth-context";

const Login = ({ onLoginToggle, onSignupToggle }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

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
      await authCtx.login();
      console.log(authCtx.isLoggedIn);
      onLoginToggle();
    }
    const role = localStorage.getItem("role");
    console.log(role);
    if (role === "admin") {
      navigate("/admin");
    }
  };

  return (
    <Modal onClose={onLoginToggle}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h1 className={classes.heading}>로그인</h1>
        <div className={classes["input-box"]}>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={inputChangeHandler}
            placeholder="이메일"
          />
          <FaUser className={classes.icon} />
        </div>

        <div className={classes["input-box"]}>
          <input
            required
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={inputChangeHandler}
            placeholder="비밀번호"
          />
          <FaLock className={classes.icon} />
        </div>

        {error && (
          <p
            className={`${classes["error-message"]} ${
              classes[authCtx.themeClass]
            }`}
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className={`${classes["login-button"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          로그인
        </button>
      </form>

      <div className={`${classes.link} ${classes[authCtx.themeClass]}`}>
        <button className={classes.signup} onClick={onSignupToggle}>
          회원가입 하러가기
        </button>
      </div>
    </Modal>
  );
};

export default Login;
