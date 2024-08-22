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

  // 사용자 목록을 새로고침하는 useEffect
  // 사용자가 삭제된 후에도 최신 사용자 목록을 유지하기 위한 코드
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 최신 사용자 목록을 가져오기 위한 API 요청
        const response = await fetch("http://localhost:3000/admin/users", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("사용자 불러오기 실패");
        }

        const resData = await response.json();

        // 가져온 사용자 목록으로 상태 업데이트
        setUsers(resData.users);
      } catch (error) {
        authCtx.errorHelper(
          error,
          "사용자 목록 조회 중에 문제가 발생했습니다. 다시 시도해 주세요."
        );
      }
    };

    fetchUsers();
  }, []);

  // 사용자를 삭제하는 함수
  const deleteUser = (userEmail) => {
    // 삭제된 사용자를 목록에서 제거한 후 상태 업데이트
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
            {/* 사용자 수를 보여줌 */}
            <p>{users.length}명의 사용자</p>
          </div>

          <p
            className={`${classes.underline} ${classes[authCtx.themeClass]}`}
          ></p>

          {/* 사용자 목록을 렌더링하거나, 사용자가 없는 경우 메시지를 표시 */}
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
