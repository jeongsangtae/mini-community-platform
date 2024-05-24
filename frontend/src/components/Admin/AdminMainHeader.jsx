import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { LuUserCircle2, LuLogOut, LuLogIn } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { MoreVertical, User } from "react-feather";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import AuthContext from "../../store/auth-context";

import classes from "./AdminMainHeader.module.css";

import Chat from "../Chat/Chat";

const AdminMainHeader = () => {
  // const [openLoginModal, setOnLoginModal] = useState(false);

  const authCtx = useContext(AuthContext);

  const navLinkClass = ({ isActive }) => {
    return isActive
      ? `${classes.active} ${classes.button} ${classes[authCtx.themeClass]}`
      : `${classes.button} ${classes[authCtx.themeClass]}`;
  };

  // const loginToggleHandler = () => {
  //   setOnLoginModal(!openLoginModal);
  //   setOnSignupModal(false);
  // };

  return (
    <>
      <header className={`${classes.header} ${classes[authCtx.themeClass]}`}>
        <h1 className={`${classes.logo} ${classes[authCtx.themeClass]}`}>
          커뮤니티 게시판
        </h1>
        {authCtx.isLoggedIn && (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/admin/posts" className={navLinkClass}>
                <div>
                  게시글<span></span>
                </div>
              </NavLink>

              <NavLink to="/admin/comments" className={navLinkClass}>
                <div>
                  댓글<span></span>
                </div>
              </NavLink>

              <NavLink to="/admin/users" className={navLinkClass} end>
                <div>
                  사용자<span></span>
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
                    {authCtx.userInfo?.name}
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
            </nav>
          </>
        )}
      </header>
      {/* {!authCtx.isLoggedIn && (
        <>         
          {openLoginModal && (
            <Login
              onLoginToggle={loginToggleHandler}
              onSignupToggle={signupToggleHandler}
            />
          )}
        </>
      )} */}
      <Chat />
    </>
  );
};

export default AdminMainHeader;
