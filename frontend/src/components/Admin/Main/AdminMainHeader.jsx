import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { User } from "react-feather";

import AuthContext from "../../../store/auth-context";
import AdminChat from "../Chat/AdminChat";
import classes from "./AdminMainHeader.module.css";

const AdminMainHeader = () => {
  const authCtx = useContext(AuthContext);

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
        {authCtx.isLoggedIn && (
          <>
            <nav className={classes.navbutton}>
              <NavLink to="/admin" className={navLinkClass} end>
                <div>
                  홈<span></span>
                </div>
              </NavLink>

              <NavLink to="/admin/posts" className={navLinkClass}>
                <div>
                  게시글<span></span>
                </div>
              </NavLink>

              <NavLink to="/admin/users" className={navLinkClass}>
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
      <AdminChat />
    </>
  );
};

export default AdminMainHeader;
