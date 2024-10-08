import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

import Modal from "../UI/Modal";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Login.module.css";

const Login = ({ onLoginToggle, onSignupToggle }) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);
  const navigate = useNavigate();

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 입력 필드가 변경될 때마다 상태 업데이트
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // 로그인 폼 제출 시 호출되는 함수
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      // 서버로 로그인 요청을 보내는 API
      const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(true);
        setErrorMessage(errorData.message);
        return null;
      }

      console.log("로그인 성공");
      await authCtx.login();

      onLoginToggle();

      // 사용자의 역할에 따라 다른 페이지로 리다이렉트
      const role = localStorage.getItem("role");

      if (role === "admin") {
        navigate("/admin"); // 관리자일 경우 관리자 페이지로 이동
      }
    } catch (error) {
      authCtx.errorHelper(
        error,
        "로그인 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
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

        {/* 오류 메시지 표시 */}
        {error && (
          <p
            className={`${classes["error-message"]} ${
              classes[uiCtx.themeClass]
            }`}
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className={`${classes["login-button"]} ${classes[uiCtx.themeClass]}`}
        >
          로그인
        </button>
      </form>

      {/* 회원가입 모달로 전환하는 내용 */}
      <div className={`${classes.link} ${classes[uiCtx.themeClass]}`}>
        <button className={classes.signup} onClick={onSignupToggle}>
          회원가입 하러가기
        </button>
      </div>
    </Modal>
  );
};

export default Login;
