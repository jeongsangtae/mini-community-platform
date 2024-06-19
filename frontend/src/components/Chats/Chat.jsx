import classes from "./Chat.module.css";

const Chat = ({ message, date }) => {
  return (
    <li className={classes["chat-container"]}>
      <div className={classes["chat-bubble"]}>
        <span className={classes.message}>{message}</span>
        <span className={classes.date}>{date}</span>
      </div>
    </li>
  );
};

export default Chat;
