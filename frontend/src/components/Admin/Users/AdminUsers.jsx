import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";

import AdminUser from "./AdminUser";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminUsers.module.css";
import LoadingIndicator from "../../UI/LoadingIndicator";

const AdminUsers = () => {
  const usersData = useLoaderData();

  const authCtx = useContext(AuthContext);

  const [users, setUsers] = useState(usersData);

  // const filteredAdmin = users.filter(
  //   (user) => user.email !== "admin@admin.com"
  // );

  const deleteUser = (userEmail) => {
    const filteredUsers = users.filter((user) => user.email !== userEmail);
    setUsers(filteredUsers);
  };

  return (
    <div className={`${classes.background} ${classes[authCtx.themeClass]}`}>
      {/* {filteredAdmin.length > 0 ? (
        <ul>
          {filteredAdmin.map((user) => {
            return (
              <AdminUser key={user._id} email={user.email} name={user.name} />
            );
          })}
        </ul>
      ) : (
        <></>
      )} */}
      {authCtx.isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className={classes["users-container"]}>
          <h1 className={`${classes.heading} ${classes[authCtx.themeClass]}`}>
            사용자 페이지
          </h1>

          <div
            className={`${classes["sub-menu"]} ${classes[authCtx.themeClass]}`}
          >
            <p>{users.length}명의 사용자</p>
          </div>

          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>

          {users.length > 0 ? (
            <ul className={classes.users}>
              {users.map((user) => {
                return (
                  <AdminUser
                    key={user._id}
                    email={user.email}
                    name={user.name}
                    onDeleteUserData={deleteUser}
                  />
                );
              })}
            </ul>
          ) : (
            <>
              <h2
                className={`${classes["no-users"]} ${
                  classes[authCtx.themeClass]
                }`}
              >
                사용자가 존재하지 않습니다.
              </h2>
              {/* <p
                className={`${classes.underline} ${
                  classes[authCtx.themeClass]
                }`}
              ></p> */}
            </>
          )}
          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
