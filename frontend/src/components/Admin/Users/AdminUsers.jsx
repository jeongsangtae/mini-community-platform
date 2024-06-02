import { useLoaderData } from "react-router-dom";
import AdminUser from "./AdminUser";

const AdminUsers = () => {
  const users = useLoaderData();
  console.log(users);

  // const filteredAdmin = users.filter(
  //   (user) => user.email !== "admin@admin.com"
  // );

  return (
    <>
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
      {users.length > 0 ? (
        <ul>
          {users.map((user) => {
            return (
              <AdminUser key={user._id} email={user.email} name={user.name} />
            );
          })}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminUsers;
