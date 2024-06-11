import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import AuthContext from "../../store/auth-context";

import classes from "./MainHeader.module.css";
import Chats from "../Chats/Chats";
import DropDownMenu from "./DropDownMenu";

const MainHeader = () => {
  const [openSignupModal, setOnSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [user, setUser] = useState({});

  console.log(user);

  const authCtx = useContext(AuthContext);

  console.log(authCtx.themeMode);
  console.log(authCtx.userInfo);
  console.log(authCtx.userInfo?._id);

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

  const dropDownButtonClassName = `${classes.button} ${
    classes["dropdown-button"]
  } ${classes[authCtx.themeClass]}`;

  return (
    <>
      <header className={`${classes.header} ${classes[authCtx.themeClass]}`}>
        <h1 className={`${classes.logo} ${classes[authCtx.themeClass]}`}>
          커뮤니티 게시판
        </h1>
        {authCtx.isLoggedIn ? (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/" className={navLinkClass} end>
                <div>
                  홈<span></span>
                </div>
              </NavLink>

              <NavLink to="/posts" className={navLinkClass} end>
                <div>
                  게시판<span></span>
                </div>
              </NavLink>

              <DropDownMenu dropDownButtonClassName={dropDownButtonClassName} />
            </nav>
            {/* <Chat userId={user._id} userEmail={user.email} /> */}
            <Chats
              userId={authCtx.userInfo?._id}
              userEmail={authCtx.userInfo?.email}
            />
          </>
        ) : (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/" className={navLinkClass} end>
                <div>
                  홈<span></span>
                </div>
              </NavLink>

              <NavLink to="/posts" className={navLinkClass} end>
                <div>
                  게시판<span></span>
                </div>
              </NavLink>

              <DropDownMenu
                onSignupToggle={signupToggleHandler}
                onLoginToggle={loginToggleHandler}
                dropDownButtonClassName={dropDownButtonClassName}
              />
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
