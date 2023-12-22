import { NavLink } from "react-router-dom";

import classes from "./MainHeader.module.css";

const MainHeader = () => {
  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.logo}>커뮤니티 게시판</h1>
        <nav className={classes.navbutton}>
          <p>
            <NavLink to="/" className={classes.button}>
              홈
            </NavLink>
          </p>
          <p>
            <NavLink to="/posts" className={classes.button}>
              게시판
            </NavLink>
          </p>
          <p>
            <NavLink to="/signup" className={classes.button}>
              회원가입
            </NavLink>
          </p>
          <p>
            <NavLink to="/login" className={classes.button}>
              로그인
            </NavLink>
          </p>
          <p>
            <NavLink to="/profile" className={classes.button}>
              프로필
            </NavLink>
          </p>
        </nav>
      </header>
    </>
  );
};

export default MainHeader;
