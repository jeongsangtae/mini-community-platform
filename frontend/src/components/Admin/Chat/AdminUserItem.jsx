const AdminUserItem = ({ userId, name, email, selectUser }) => {
  const clickHandler = () => {
    selectUser(userId);
  };

  return (
    <li>
      <button onClick={clickHandler}>
        <div>{name}</div>
        <div>{email}</div>
      </button>
    </li>
  );
};

export default AdminUserItem;
