import { useNavigate } from "react-router-dom";
import classes from "./Modal.module.css";

const Modal = ({ children }) => {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={classes.backdrop} onClick={closeHandler} />
      <div className={classes.modal}>{children}</div>
    </>
  );
};

export default Modal;
