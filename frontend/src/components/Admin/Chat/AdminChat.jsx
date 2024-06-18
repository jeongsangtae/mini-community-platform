import classes from "./AdminChat.module.css";

const AdminChat = ({ message, date }) => {
  return (
    <div className={classes["admin-chat-container"]}>
      <div className={classes["chat-bubble"]}>
        <span className={classes.message}>{message}</span>
        <span className={classes.date}>{date}</span>
      </div>
    </div>
  );
};

export default AdminChat;
