import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { LuUserCircle2, LuLogOut } from "react-icons/lu";
import { MoreVertical, User } from "react-feather";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import AuthContext from "../../store/auth-context";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const [openSignupModal, setOnSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [user, setUser] = useState({});

  // console.log(user);

  const authCtx = useContext(AuthContext);

  console.log(authCtx.themeMode);

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
        setUser(resData);
        console.log(resData);
      } catch (error) {
        console.error("로그인 유지 불가능", error);
      }
    };

    fetchData();
  }, []);

  const signupToggleHandler = () => {
    setOnSignupModal(!openSignupModal);
    setOnLoginModal(false);
  };

  const loginToggleHandler = () => {
    setOnLoginModal(!openLoginModal);
    setOnSignupModal(false);
  };

  // const logoutHandler = async () => {
  //   const response = await fetch("http://localhost:3000/logout", {
  //     method: "POST",
  //     body: JSON.stringify(),
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   });

  //   if (response.ok) {
  //     authCtx.logout();
  //     console.log(authCtx.isLoggedIn);
  //   }
  // };

  // const accessTokenTestHandler = async () => {
  //   await fetch("http://localhost:3000/accessToken", {
  //     credentials: "include",
  //   });
  // };

  // const refreshTokenTestHandler = async () => {
  //   await fetch("http://localhost:3000/refreshToken", {
  //     credentials: "include",
  //   });
  // };

  const navLinkClass = ({ isActive }) => {
    return isActive
      ? `${classes.active} ${classes.button} ${classes[authCtx.themeClass]}`
      : `${classes.button} ${classes[authCtx.themeClass]}`;
  };

  return (
    <>
      <header className={`${classes.header} ${classes[authCtx.themeClass]}`}>
        <h1 className={`${classes.logo} ${classes[authCtx.themeClass]}`}>
          커뮤니티 게시판
        </h1>
        {authCtx.isLoggedIn ? (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/" className={navLinkClass}>
                <div>
                  홈<span></span>
                </div>
              </NavLink>

              <NavLink to="/posts" className={navLinkClass} end>
                <div>
                  게시판<span></span>
                </div>
              </NavLink>

              <div className={classes.dropdown}>
                <div className={classes.iconWrapper}>
                  <User
                    className={`${classes.icon} ${classes[authCtx.themeClass]}`}
                  />
                  <div
                    className={`${classes.circle} ${
                      classes[authCtx.themeClass]
                    }`}
                  ></div>
                </div>
                <div
                  className={`${classes["dropdown-content"]} ${
                    classes[authCtx.themeClass]
                  }`}
                >
                  <NavLink
                    to="/profile"
                    className={`${classes.button} ${
                      classes["dropdown-button"]
                    } ${classes[authCtx.themeClass]}`}
                  >
                    <LuUserCircle2 className={classes["dropdown-icon"]} />
                    계정
                  </NavLink>
                  <button
                    className={`${classes.button} ${
                      classes["dropdown-button"]
                    } ${classes[authCtx.themeClass]}`}
                    onClick={authCtx.logout}
                  >
                    <LuLogOut className={classes["dropdown-icon"]} />
                    로그아웃
                  </button>
                  <p
                    className={`${classes.underline} ${
                      classes[authCtx.themeClass]
                    }`}
                  ></p>
                  <div className={classes["toggle-button"]}>
                    <div
                      className={`${classes["toggle-mode"]} ${
                        classes[authCtx.themeClass]
                      }`}
                    >
                      라이트 모드
                    </div>
                    <div className={`${classes.toggle} ${classes.normal}`}>
                      <input
                        id="normal"
                        className={classes["normal-check"]}
                        defaultChecked={authCtx.themeMode === "dark"}
                        type="checkbox"
                        onChange={authCtx.themeModeToggle}
                      />
                      <label
                        htmlFor="normal"
                        className={classes["toggle-item"]}
                      ></label>
                    </div>
                  </div>
                </div>
              </div>

              {/* <p>
                <button
                  className={classes.button}
                  onClick={accessTokenTestHandler}
                >
                  액세스토큰
                </button>
              </p> */}
              {/* <p>
                <button
                  className={classes.button}
                  onClick={authCtx.refreshToken}
                >
                  리프레쉬토큰
                </button>
              </p> */}
              {/* <p>
                <button
                  className={classes.button}
                  onClick={authCtx.refreshTokenExp}
                >
                  리프레쉬토큰 EXP
                </button>
              </p> */}
            </nav>
          </>
        ) : (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/" className={navLinkClass}>
                <div>
                  홈<span></span>
                </div>
              </NavLink>

              <NavLink to="/posts" className={navLinkClass}>
                <div>
                  게시판<span></span>
                </div>
              </NavLink>

              <div className={classes.dropdown}>
                <div className={classes.iconWrapper}>
                  <MoreVertical
                    className={`${classes.icon} ${classes[authCtx.themeClass]}`}
                  />
                </div>
                <div
                  className={`${classes["dropdown-content"]} ${
                    classes[authCtx.themeClass]
                  }`}
                >
                  <button
                    className={`${classes.button} ${
                      classes["dropdown-button"]
                    } ${classes[authCtx.themeClass]}`}
                    onClick={signupToggleHandler}
                  >
                    회원가입
                  </button>
                  <button
                    className={`${classes.button} ${
                      classes["dropdown-button"]
                    } ${classes[authCtx.themeClass]}`}
                    onClick={loginToggleHandler}
                  >
                    로그인
                  </button>
                  <p className={classes.underline}></p>
                  <div className={classes["toggle-button"]}>
                    <div
                      className={`${classes["toggle-mode"]} ${
                        classes[authCtx.themeClass]
                      }`}
                    >
                      라이트 모드
                    </div>
                    <div className={`${classes.toggle} ${classes.normal}`}>
                      <input
                        id="normal"
                        className={classes["normal-check"]}
                        defaultChecked={authCtx.themeMode === "dark"}
                        type="checkbox"
                        onChange={authCtx.themeModeToggle}
                      />
                      <label
                        htmlFor="normal"
                        className={classes["toggle-item"]}
                      ></label>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </>
        )}
      </header>
      {!authCtx.isLoggedIn && (
        <>
          {openSignupModal && (
            <Signup
              onSignupToggle={signupToggleHandler}
              onLoginToggle={loginToggleHandler}
            />
          )}
          {openLoginModal && (
            <Login
              onLoginToggle={loginToggleHandler}
              onSignupToggle={signupToggleHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default MainHeader;
