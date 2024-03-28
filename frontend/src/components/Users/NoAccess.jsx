import classes from "./NoAccess.module.css";
const NoAccess = ({ message }) => {
  return (
    <div className={classes["no-access"]}>
      <h1>{message.title}</h1>
      <p>{message.description}</p>
    </div>
  );
};

export default NoAccess;
