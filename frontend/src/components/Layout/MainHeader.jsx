import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

import Login from "../Users/Login";
import Signup from "../Users/Signup";
import NavigationLinks from "./NavigationLinks";
import DropDownMenu from "./DropDownMenu";
import Chats from "../Chats/Chats";
import Overlay from "../UI/Overlay";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./MainHeader.module.css";

const MainHeader = () => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [openSignupModal, setOnSignupModal] = useState(false);
  const [openLoginModal, setOnLoginModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState({});

  // 컴포넌트가 마운트될 때 로그인 유지 상태를 확인하는 내용
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/login/success`, {
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

  const menuToggleHandler = () => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  };

  const menuCloseHandler = () => {
    setOpenMenu(false);
  };

  // 네비게이션 링크의 활성화 상태에 따라 클래스 설정 (데스크탑)
  const desktopNavLinkClass = ({ isActive }) => {
    return isActive
      ? `${classes.active} ${classes.button} ${classes[uiCtx.themeClass]}`
      : `${classes.button} ${classes[uiCtx.themeClass]}`;
  };

  // 네비게이션 링크의 활성화 상태에 따라 클래스 설정 (모바일)
  const mobileNavLinkClass = ({ isActive }) => {
    return isActive
      ? `${classes["mobile-active"]} ${classes["mobile-button"]} ${
          classes[uiCtx.themeClass]
        }`
      : `${classes["mobile-button"]} ${classes[uiCtx.themeClass]}`;
  };

  const dropDownButtonClassName = uiCtx.isDesktop
    ? `${classes.button} ${classes["dropdown-button"]} ${
        classes[uiCtx.themeClass]
      }`
    : `${classes.button} ${classes.mobile} ${
        classes["mobile-dropdown-button"]
      } ${classes[uiCtx.themeClass]}`;

  return (
    <>
      <header className={`${classes.header} ${classes[uiCtx.themeClass]}`}>
        <Link
          to={authCtx.userInfo?.role === "admin" ? "/admin/posts" : "posts"}
        >
          <h1 className={`${classes.logo} ${classes[uiCtx.themeClass]}`}>
            커뮤니티 게시판
          </h1>
        </Link>

        <nav className={classes.navbutton}>
          {uiCtx.isDesktop ? (
            <>
              <NavigationLinks navLinkClass={desktopNavLinkClass} />

              <DropDownMenu
                dropDownButtonClassName={dropDownButtonClassName}
                onSignupToggle={
                  !authCtx.isLoggedIn ? signupToggleHandler : undefined
                }
                onLoginToggle={
                  !authCtx.isLoggedIn ? loginToggleHandler : undefined
                }
              />
            </>
          ) : (
            // 모바일 환경에서 보여지는 햄버거 메뉴 버튼
            <RxHamburgerMenu
              className={`${classes["ham-burger"]} ${
                classes[uiCtx.themeClass]
              }`}
              onClick={menuToggleHandler}
            />
          )}
        </nav>
      </header>

      {/* 모바일 환경에서 햄버거 버튼 클릭 시 보여지는 항목 */}
      <>
        {openMenu && (
          <Overlay onClose={menuCloseHandler} className="main-header-overlay" />
        )}
        {uiCtx.isMobile && openMenu && (
          <div
            className={`${classes["is-mobile"]} ${classes[uiCtx.themeClass]} ${
              openMenu ? `${classes.open}` : `""`
            }`}
          >
            <NavigationLinks navLinkClass={mobileNavLinkClass} />

            <DropDownMenu
              dropDownButtonClassName={dropDownButtonClassName}
              onSignupToggle={
                !authCtx.isLoggedIn ? signupToggleHandler : undefined
              }
              onLoginToggle={
                !authCtx.isLoggedIn ? loginToggleHandler : undefined
              }
            />
          </div>
        )}
      </>

      {/* 채팅 컴포넌트는 로그인되고, 사용자 역할이 user인 사용자에게만 표시 */}
      {authCtx.isLoggedIn && authCtx.userInfo?.role === "user" && (
        <Chats
          userId={authCtx.userInfo?._id}
          userEmail={authCtx.userInfo?.email}
        />
      )}

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
