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
      onSignupToggle();
      return navigate("signup-success");
    }
  };

  return (
    <Modal onClose={onSignupToggle}>
      {error && <p>{errorMessage}</p>}
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

        {/* <div className={classes.actions}> */}
        <button
          type="submit"
          className={`${classes["signup-button"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          가입
        </button>
        {/* <button onClick={onSignupToggle}>취소</button> */}
        {/* </div> */}
      </form>
      <div className={`${classes.link} ${classes[authCtx.themeClass]}`}>
        <button className={classes.login} onClick={onLoginToggle}>
          로그인 하러가기
        </button>
      </div>
    </Modal>
  );
};

export default Signup;
