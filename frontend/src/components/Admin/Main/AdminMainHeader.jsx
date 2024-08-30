import { useContext } from "react";
import { NavLink, useLoaderData } from "react-router-dom";

import DropDownMenu from "../../Layout/DropDownMenu";
import AdminUserList from "../Chat/AdminUserList";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminMainHeader.module.css";

const AdminMainHeader = () => {
  const usersData = useLoaderData();
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

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

        {/* 관리자로 로그인된 경우에만 네비게이션 메뉴와 사용자 목록을 표시 */}
        {authCtx.isLoggedIn && authCtx.userInfo?.role === "admin" && (
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

            {/* 관리자가 접근할 수 있는 사용자 목록 및 채팅 기능 */}
            <AdminUserList
              adminId={authCtx.userInfo?._id}
              adminEmail={authCtx.userInfo?.email}
              usersData={usersData}
            />
          </>
        )}
      </header>
    </>
  );
};

export default AdminMainHeader;
