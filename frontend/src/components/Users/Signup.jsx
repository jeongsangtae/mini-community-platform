import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

import Modal from "../UI/Modal";
import classes from "./Signup.module.css";
import AuthContext from "../../store/auth-context";

const Signup = ({ onLoginToggle, onSignupToggle }) => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const authCtx = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // 입력 필드가 변경될 때마다 상태 업데이트
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setSignupData({ ...signupData, [name]: value });
  };

  // 회원가입 폼 제출 시 호출되는 함수
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      // 서버로 회원가입 요청을 보내는 API
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
      }

      console.log("회원가입 성공");
      onSignupToggle();

      return navigate("signup-success");
    } catch (error) {
      authCtx.errorHelper(
        error,
        "회원가입 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <Modal onClose={onSignupToggle}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h1 className={classes.heading}>회원가입</h1>
        <div className={classes["input-box"]}>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={signupData.email}
            onChange={inputChangeHandler}
            placeholder="이메일"
          />
          <FaUser className={classes.icon} />
        </div>

        <div className={classes["input-box"]}>
          <input
            required
            type="email"
            id="confirm-email"
            name="confirmEmail"
            value={signupData.confirmEmail}
            onChange={inputChangeHandler}
            placeholder="이메일 확인"
          />
          <FaUser className={classes.icon} />
        </div>

        <div className={classes["input-box"]}>
          <input
            required
            type="text"
            id="username"
            name="username"
            value={signupData.username}
            onChange={inputChangeHandler}
            placeholder="이름"
          />
          <FaUser className={classes.icon} />
        </div>

        <div className={classes["input-box"]}>
          <input
            required
            type="password"
            id="password"
            name="password"
            value={signupData.password}
            onChange={inputChangeHandler}
            placeholder="비밀번호"
          />
          <FaLock className={classes.icon} />
        </div>

        {/* 오류 메시지 표시 */}
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
          className={`${classes["signup-button"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          가입
        </button>
      </form>

      {/* 로그인 모달로 전환하는 내용 */}
      <div className={`${classes.link} ${classes[authCtx.themeClass]}`}>
        <button className={classes.login} onClick={onLoginToggle}>
          로그인 하러가기
        </button>
      </div>
    </Modal>
  );
};

export default Signup;
