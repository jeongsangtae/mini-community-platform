import AdminUsers from "../components/Admin/Users/AdminUsers";

const AdminUsersPage = () => {
  return (
    <>
      <AdminUsers />
    </>
  );
};

export default AdminUsersPage;

export const loader = async () => {
  const response = await fetch("http://localhost:3000/admin/users", {
    credentials: "include",
  });
  const resData = await response.json();
  return resData.users;
};
