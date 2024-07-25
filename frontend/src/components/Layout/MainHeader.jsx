import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import DropDownMenu from "./DropDownMenu";
import Chats from "../Chats/Chats";
import AuthContext from "../../store/auth-context";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const [openSignupModal, setOnSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [user, setUser] = useState({});

  const authCtx = useContext(AuthContext);

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

          {authCtx.isLoggedIn ? (
            <>
              <DropDownMenu dropDownButtonClassName={dropDownButtonClassName} />
              <Chats
                userId={authCtx.userInfo?._id}
                userEmail={authCtx.userInfo?.email}
              />
            </>
          ) : (
            <DropDownMenu
              onSignupToggle={signupToggleHandler}
              onLoginToggle={loginToggleHandler}
              dropDownButtonClassName={dropDownButtonClassName}
            />
          )}
        </nav>
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
