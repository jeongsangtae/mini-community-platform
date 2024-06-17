import { useContext } from "react";
import { NavLink } from "react-router-dom";

import DropDownMenu from "../../Layout/DropDownMenu";
import AdminChats from "../Chat/AdminChats";
import AuthContext from "../../../store/auth-context";

import classes from "./AdminMainHeader.module.css";

const AdminMainHeader = () => {
  const authCtx = useContext(AuthContext);

  console.log(authCtx.userInfo);
  console.log(authCtx.userInfo?._id);

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

              <DropDownMenu dropDownButtonClassName={dropDownButtonClassName} />
            </nav>
          </>
        )}
      </header>
      <AdminChats
        adminId={authCtx.userInfo?._id}
        adminEmail={authCtx.userInfo?.email}
      />
    </>
  );
};

export default AdminMainHeader;
