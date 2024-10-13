import { useContext } from "react";

import UIContext from "../../store/ui-context";

import classes from "./Modal.module.css";

const Modal = ({ children, onClose }) => {
  const uiCtx = useContext(UIContext);

  // useEffect(() => {
  //   uiCtx.modalChecked();

  //   return () => uiCtx.modalChecked();
  // }, [uiCtx]);

  return (
    <>
      <div className={classes.backdrop} onClick={onClose} />
      <dialog open className={`${classes.modal} ${classes[uiCtx.themeClass]}`}>
        {children}
      </dialog>
    </>
  );
};

export default Modal;
