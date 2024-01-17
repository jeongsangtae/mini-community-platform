import { useState } from "react";

import { NavLink } from "react-router-dom";
import Login from "../Users/Login";
import Signup from "../Users/Signup";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const [onSignup, setOnSignup] = useState(false);
  const [onLogin, setOnLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signupToggleHandler = () => {
    setOnSignup(!onSignup);
  };

  const loginToggleHandler = async () => {
    setOnLogin(!onLogin);

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const authenticatedData = await response.json();
      setIsAuthenticated(authenticatedData.isAuthenticated);
      toggle(authenticatedData.isAuthenticated);
    }
  };

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.logo}>커뮤니티 게시판</h1>
        {isAuthenticated ? (
          <>
            <nav className={classes.navbutton}>
              <p>
                <NavLink to="/" className={classes.button}>
                  홈
                </NavLink>
              </p>
              <p>
                <NavLink to="/posts" className={classes.button}>
                  게시판
                </NavLink>
              </p>
              <p>
                <NavLink to="/profile" className={classes.button}>
                  프로필
                </NavLink>
              </p>
            </nav>
          </>
        ) : (
          <>
            <nav className={classes.navbutton}>
              <p>
                <NavLink to="/" className={classes.button}>
                  홈
                </NavLink>
              </p>
              <p>
                <NavLink to="/posts" className={classes.button}>
                  게시판
                </NavLink>
              </p>
              <p>
                <button
                  className={classes.button}
                  onClick={signupToggleHandler}
                >
                  회원가입
                </button>
              </p>
              <p>
                <button className={classes.button} onClick={loginToggleHandler}>
                  로그인
                </button>
              </p>
            </nav>
          </>
        )}
      </header>
      {!isAuthenticated && (
        <>
          {onSignup && <Signup toggle={signupToggleHandler} />}
          {onLogin && <Login toggle={loginToggleHandler} />}
        </>
      )}
    </>
  );
};

export default MainHeader;
