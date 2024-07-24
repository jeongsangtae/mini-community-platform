import { useState, useEffect, useContext } from "react";
import { useRouteLoaderData } from "react-router-dom";

import AdminUser from "./AdminUser";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminUsers.module.css";
import LoadingIndicator from "../../UI/LoadingIndicator";

const AdminUsers = () => {
  const usersData = useRouteLoaderData("users-data");

  const authCtx = useContext(AuthContext);

  const [users, setUsers] = useState(usersData);

  // 사용자 삭제된 후에 페이지 이동하고 다시 확인 했을 때, 사용자가 그대로 남아있는 것처럼 보이는 것을 방지하기 위한 코드
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3000/admin/users", {
        credentials: "include",
      });
      const resData = await response.json();
      setUsers(resData.users);
    };

    fetchUsers();
  }, []);

  const deleteUser = (userEmail) => {
    const filteredUsers = users.filter((user) => user.email !== userEmail);
    setUsers(filteredUsers);
  };

  return (
    <div className={`${classes.background} ${classes[authCtx.themeClass]}`}>
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
