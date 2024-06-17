import classes from "./AdminChat.module.css";

const AdminChat = ({ message }) => {
  return (
    <div className={classes["admin-chat"]}>
      <li>{message}</li>
    </div>
  );
};

export default AdminChat;
