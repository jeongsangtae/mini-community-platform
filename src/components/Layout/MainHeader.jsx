import { NavLink } from "react-router-dom";

const MainHeader = () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink>홈</NavLink>
            </li>
            <li>
              <NavLink>게시판</NavLink>
            </li>
            <li>
              <NavLink>프로필</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default MainHeader;
