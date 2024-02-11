import { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import Login from "../Users/Login";
import Signup from "../Users/Signup";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  // const [accessTokenVaild, setAccessTokenValid] = useState("")
  //  const [refreshTokenValid, setRefreshTokenValid] = useState("")

  console.log(user);
  console.log(user.name);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/login/success", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("네트워크 오류");
        }
        const resData = await response.json();
        setAuthenticated((prevAuthenticated) => !prevAuthenticated);
        setUser(resData);
        console.log(resData);
      } catch (error) {
        console.error("로그인 유지 불가능", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const accessTokenMonitoring = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/refreshToken", {
  //         credentials: "include",
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //       }
  //     } catch (error) {}
  //   };
  // });

  const signupToggleHandler = () => {
    setOpenSignupModal(!openSignupModal);
  };

  const loginToggleHandler = () => {
    setOnLoginModal(!openLoginModal);
  };

  const logoutHandler = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      body: JSON.stringify(),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      setAuthenticated(!authenticated);
    }
  };

  const authenticatedHandler = (isAuthenticated) => {
    console.log(isAuthenticated);
    setAuthenticated(isAuthenticated);
  };

  const accessTokenTestHandler = async () => {
    await fetch("http://localhost:3000/accessToken", {
      credentials: "include",
    });
  };

  const refreshTokenTestHandler = async () => {
    await fetch("http://localhost:3000/refreshToken", {
      credentials: "include",
    });
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
              <p>
                <button
                  className={classes.button}
                  onClick={accessTokenTestHandler}
                >
                  액세스토큰
                </button>
              </p>
              <p>
                <button
                  className={classes.button}
                  onClick={refreshTokenTestHandler}
                >
                  리프레쉬토큰
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
    </>
  );
};

export default MainHeader;
