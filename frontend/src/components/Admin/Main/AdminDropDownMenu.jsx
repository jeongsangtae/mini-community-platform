import { useContext } from "react";
import { LuLogOut } from "react-icons/lu";
import { User } from "react-feather";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminDropDownMenu.module.css";

const AdminDropDownMenu = ({ dropDownButton }) => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={classes.dropdown}>
      <div className={classes["icon-wrapper"]}>
        <User className={`${classes.icon} ${classes[authCtx.themeClass]}`} />
        <div
          className={`${classes.circle} ${classes[authCtx.themeClass]}`}
        ></div>
      </div>
      <div
        className={`${classes["dropdown-content"]} ${
          classes[authCtx.themeClass]
        }`}
      >
        <button className={dropDownButton} onClick={authCtx.logout}>
          <LuLogOut className={classes["dropdown-icon"]} />
          로그아웃
        </button>
        <p
          className={`${classes.underline} ${classes[authCtx.themeClass]}`}
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
            <label htmlFor="normal" className={classes["toggle-item"]}></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDropDownMenu;
