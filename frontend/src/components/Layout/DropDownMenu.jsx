import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { LuUserCircle2, LuLogOut, LuLogIn } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { MoreHorizontal, MoreVertical, User } from "react-feather";

import Overlay from "../UI/Overlay";

import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./DropDownMenu.module.css";

const DropDownMenu = ({
  onSignupToggle,
  onLoginToggle,
  dropDownButtonClassName,
}) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownToggleHandler = () => {
    if (uiCtx.isMobile) {
      setOpenDropdown((prevOpenDropdown) => !prevOpenDropdown);
    }
  };

  const dropdownCloseHandler = () => {
    setOpenDropdown(false);
  };

  const dropdownContentClass = uiCtx.isMobile
    ? openDropdown
      ? authCtx.userInfo?.role === "admin"
        ? `${classes["mobile-dropdown-content-admin"]} ${
            classes[uiCtx.themeClass]
          }`
        : `${classes["mobile-dropdown-content"]} ${classes[uiCtx.themeClass]}`
      : `${classes["display-none"]}`
    : `${classes["dropdown-content"]} ${classes[uiCtx.themeClass]}`;

  // 드롭다운 메뉴 내용 정의 (로그인 상태에 따라 다르게 렌더링)
  const dropDownContent = (
    <>
      {authCtx.isLoggedIn ? (
        <>
          {/* 사용자가 로그인한 상태이면서 일반 유저일 때 프로필 링크 표시 */}
          {localStorage.getItem("role") === "user" && (
            <NavLink to="/profile" className={dropDownButtonClassName}>
              <LuUserCircle2 className={classes["dropdown-icon"]} />
              {authCtx.userInfo?.name}
            </NavLink>
          )}
          <button className={dropDownButtonClassName} onClick={authCtx.logout}>
            <LuLogOut className={classes["dropdown-icon"]} />
            로그아웃
          </button>
        </>
      ) : (
        <>
          {/* 사용자가 로그인하지 않은 상태일 때 회원가입 및 로그인 버튼 표시 */}
          <button className={dropDownButtonClassName} onClick={onSignupToggle}>
            <FaRegAddressCard className={classes["dropdown-icon"]} />
            회원가입
          </button>
          <button className={dropDownButtonClassName} onClick={onLoginToggle}>
            <LuLogIn className={classes["dropdown-icon"]} />
            로그인
          </button>
        </>
      )}
      <p className={`${classes.underline} ${classes[uiCtx.themeClass]}`}></p>

      {/* 테마 모드 전환 버튼 */}
      <div
        className={`${classes["toggle-button"]} ${
          uiCtx.isMobile ? classes.mobile : ""
        }`}
      >
        <div
          className={`${classes["toggle-mode"]} ${classes[uiCtx.themeClass]}`}
        >
          {uiCtx.themeMode === "light" ? "라이트 모드" : "다크 모드"}
        </div>
        <div className={`${classes.toggle} ${classes.normal}`}>
          <input
            id="normal"
            className={classes["normal-check"]}
            defaultChecked={uiCtx.themeMode === "dark"}
            type="checkbox"
            onChange={uiCtx.themeModeToggle}
          />
          <label htmlFor="normal" className={classes["toggle-item"]}></label>
        </div>
      </div>
    </>
  );

  return (
    <>
      {openDropdown && (
        <Overlay onClose={dropdownCloseHandler} className="dropdown-overlay" />
      )}
      <div
        className={`${classes.dropdown} ${
          uiCtx.isMobile ? classes.mobile : ""
        }`}
        onClick={dropdownToggleHandler}
      >
        <div className={classes["icon-wrapper"]}>
          {/* 로그인 상태에 따라 다른 아이콘을 표시 */}
          {authCtx.isLoggedIn ? (
            <>
              <User
                className={`${classes.icon} ${classes[uiCtx.themeClass]}`}
              />
              <div
                className={`${classes.circle} ${classes[uiCtx.themeClass]}`}
              ></div>
            </>
          ) : uiCtx.isDesktop ? (
            <MoreVertical
              className={`${classes.icon} ${classes[uiCtx.themeClass]}`}
            />
          ) : (
            <MoreHorizontal
              className={`${classes["mobile-icon"]} ${
                classes[uiCtx.themeClass]
              }`}
            />
          )}
        </div>
        <div className={dropdownContentClass}>{dropDownContent}</div>
      </div>
    </>
  );
};

export default DropDownMenu;
