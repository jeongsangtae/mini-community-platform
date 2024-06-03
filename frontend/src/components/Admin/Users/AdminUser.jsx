import { useContext } from "react";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminUser.module.css";

const AdminUser = ({ email, name }) => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <div className={classes.userWrapper}>
        <li className={`${classes.user} ${classes[authCtx.themeClass]}`}>
          <p>
            <div>{email}</div>
            <div>{name}</div>
          </p>
        </li>
      </div>
      {/* <p className={`${classes.underline} ${classes[authCtx.themeClass]}`}></p> */}
    </>
  );
};

export default AdminUser;
