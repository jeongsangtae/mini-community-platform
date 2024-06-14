import classes from "./Chat.module.css";

const Chat = ({ message }) => {
  return (
    <div className={classes.chat}>
      <li>{message}</li>
    </div>
  );
};

export default Chat;
