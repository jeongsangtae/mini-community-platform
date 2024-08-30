import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import DropDownMenu from "./DropDownMenu";
import Chats from "../Chats/Chats";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const [openSignupModal, setOnSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [user, setUser] = useState({});

  // 컴포넌트가 마운트될 때 로그인 유지 상태를 확인하는 내용
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/login/success", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("로그인 상태 확인 실패");
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

  // 네비게이션 링크의 활성화 상태에 따라 클래스 설정
  const navLinkClass = ({ isActive }) => {
    return isActive
      ? `${classes.active} ${classes.button} ${classes[uiCtx.themeClass]}`
      : `${classes.button} ${classes[uiCtx.themeClass]}`;
  };

  const dropDownButtonClassName = `${classes.button} ${
    classes["dropdown-button"]
  } ${classes[uiCtx.themeClass]}`;

  return (
    <>
      <header className={`${classes.header} ${classes[uiCtx.themeClass]}`}>
        <h1 className={`${classes.logo} ${classes[uiCtx.themeClass]}`}>
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

          {/* 로그인 상태 및 사용자 역할에 따라 다른 메뉴와 채팅 기능 표시 */}
          {authCtx.isLoggedIn && authCtx.userInfo?.role === "user" ? (
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

      {/* 로그인되지 않은 경우 회원가입 및 로그인 모달 표시 */}
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
