const AdminUser = ({ email, name }) => {
  return (
    <>
      <li>
        <div>{email}</div>
        <div>{name}</div>
      </li>
    </>
  );
};

export default AdminUser;
