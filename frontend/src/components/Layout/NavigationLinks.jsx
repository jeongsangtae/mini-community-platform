import { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../store/auth-context";

const NavigationLinks = ({ navLinkClass }) => {
  const authCtx = useContext(AuthContext);

  const navLinkPath = authCtx.userInfo?.role === "admin" ? "/admin" : "";

  return (
    <>
      <NavLink to={navLinkPath} className={navLinkClass} end>
        <div>
          홈<span></span>
        </div>
      </NavLink>

      <NavLink to={`${navLinkPath}/posts`} className={navLinkClass}>
        <div>
          게시글<span></span>
        </div>
      </NavLink>

      {authCtx.userInfo?.role === "admin" && (
        <NavLink to={`${navLinkPath}/users`} className={navLinkClass}>
          <div>
            사용자<span></span>
          </div>
        </NavLink>
      )}
    </>
  );
};

export default NavigationLinks;
