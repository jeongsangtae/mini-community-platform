import classes from "./Chat.module.css";

const Chat = ({ message, date }) => {
  return (
    <div className={classes["chat-container"]}>
      <div className={classes["chat-bubble"]}>
        <span className={classes.message}>{message}</span>
        <span className={classes.date}>{date}</span>
      </div>
    </div>
  );
};

export default Chat;
