import { useState, useContext } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

import NavigationLinks from "../../Layout/NavigationLinks";
import DropDownMenu from "../../Layout/DropDownMenu";
import AdminUserList from "../Chat/AdminUserList";
import Overlay from "../../UI/Overlay";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminMainHeader.module.css";
import AdminPopupEdit from "../Popup/AdminPopupEdit";

const AdminMainHeader = () => {
  const usersData = useLoaderData();
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [popupEditToggle, setPopupEditToggle] = useState(false);

  const menuToggleHandler = () => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  };

  const menuCloseHandler = () => {
    setOpenMenu(false);
  };

  const popupEditToggleHandler = () => {
    setPopupEditToggle(!popupEditToggle);
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
          to={authCtx.userInfo?.role === "admin" ? "/admin/posts" : "/posts"}
        >
          <h1 className={`${classes.logo} ${classes[uiCtx.themeClass]}`}>
            커뮤니티 게시판
          </h1>
        </Link>

        <nav className={classes.navbutton}>
          {authCtx.isLoggedIn &&
          authCtx.userInfo?.role === "admin" &&
          uiCtx.isDesktop ? (
            <>
              <NavigationLinks navLinkClass={desktopNavLinkClass} />

              <DropDownMenu
                dropDownButtonClassName={dropDownButtonClassName}
                onPopupEditToggle={popupEditToggleHandler}
              />
            </>
          ) : (
            authCtx.isLoggedIn &&
            authCtx.userInfo?.role === "admin" && (
              // 모바일 환경에서 보여지는 햄버거 메뉴 버튼
              <RxHamburgerMenu
                className={`${classes["ham-burger"]} ${
                  classes[uiCtx.themeClass]
                }`}
                onClick={menuToggleHandler}
              />
            )
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
              onPopupEditToggle={popupEditToggleHandler}
            />
          </div>
        )}
      </>

      {/* 채팅 컴포넌트는 로그인되고, 사용자 역할이 admin인 사용자에게만 표시 */}
      {/* 관리자가 접근할 수 있는 사용자 목록 및 채팅 기능 */}
      {authCtx.isLoggedIn && authCtx.userInfo?.role === "admin" && (
        <AdminUserList
          adminId={authCtx.userInfo?._id}
          adminEmail={authCtx.userInfo?.email}
          usersData={usersData}
        />
      )}

      {/* 팝업 수정을 클릭하면 열리는 팝업 수정 컴포넌트 */}
      {/* 관리자가 팝업 내용을 수정할 수 있는 모달 */}
      {popupEditToggle && <AdminPopupEdit />}
    </>
  );
};

export default AdminMainHeader;
