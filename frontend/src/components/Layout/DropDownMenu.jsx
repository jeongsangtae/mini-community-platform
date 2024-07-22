import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LuUserCircle2, LuLogOut, LuLogIn } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { MoreVertical, User } from "react-feather";

import AuthContext from "../../store/auth-context";
import classes from "./DropDownMenu.module.css";

const DropDownMenu = ({
  onSignupToggle,
  onLoginToggle,
  dropDownButtonClassName,
}) => {
  const authCtx = useContext(AuthContext);

  const dropDownContent = (
    <>
      {authCtx.isLoggedIn ? (
        <>
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
      <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p>
      <div className={classes["toggle-button"]}>
        <div
          className={`${classes["toggle-mode"]} ${classes[authCtx.themeClass]}`}
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
          <label htmlFor="normal" className={classes["toggle-item"]}></label>
        </div>
      </div>
    </>
  );

  return (
    <div className={classes.dropdown}>
      <div className={classes["icon-wrapper"]}>
        {authCtx.isLoggedIn ? (
          <>
            <User
              className={`${classes.icon} ${classes[authCtx.themeClass]}`}
            />
            <div
              className={`${classes.circle} ${classes[authCtx.themeClass]}`}
            ></div>
          </>
        ) : (
          <MoreVertical
            className={`${classes.icon} ${classes[authCtx.themeClass]}`}
          />
        )}
      </div>
      <div
        className={`${classes["dropdown-content"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        {dropDownContent}
      </div>
    </div>
  );
};

export default DropDownMenu;
