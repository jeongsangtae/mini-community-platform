import { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import Login from "../Users/Login";
import Signup from "../Users/Signup";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  console.log(authenticated);

  useEffect(() => {
    const isAuthenticated = !!sessionStorage.getItem("token");
    setAuthenticated(isAuthenticated);
  }, []);

  const signupToggleHandler = () => {
    setOpenSignupModal(!openSignupModal);
  };

  const loginToggleHandler = () => {
    setOnLoginModal(!openLoginModal);
  };

  const logoutHandler = async () => {
    sessionStorage.removeItem("token");
    setAuthenticated(!authenticated);
  };

  const authenticatedHandler = (isAuthenticated) => {
    console.log(isAuthenticated);
    // sessionStorage.setItem("token", authData.token);
    setAuthenticated(isAuthenticated);
  };

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.logo}>커뮤니티 게시판</h1>
        {authenticated ? (
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
              <p>
                <button className={classes.button} onClick={logoutHandler}>
                  로그아웃
                </button>
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
        {/* <nav className={classes.navbutton}>
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
            <button className={classes.button} onClick={signupToggleHandler}>
              회원가입
            </button>
          </p>
          <p>
            <button className={classes.button} onClick={loginToggleHandler}>
              로그인
            </button>
          </p>
        </nav> */}
      </header>
      {!authenticated && (
        <>
          {openSignupModal && <Signup onToggle={signupToggleHandler} />}
          {openLoginModal && (
            <Login
              onToggle={loginToggleHandler}
              onLogin={authenticatedHandler}
            />
          )}
        </>
      )}
      {/* {onSignup && <Signup toggle={signupToggleHandler} />}
      {onLogin && <Login toggle={loginToggleHandler} />} */}
    </>
  );
};

export default MainHeader;
