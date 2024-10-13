import { useEffect, useContext } from "react";

import UIContext from "../../store/ui-context";

import classes from "./Modal.module.css";

const Modal = ({ children, onClose }) => {
  const uiCtx = useContext(UIContext);

  // useEffect(() => {
  //   // 모달이 열릴 때 body 스크롤을 막음
  //   document.body.style.overflow = "hidden";

  //   // 모달이 닫힐 때 body 스크롤을 복구
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);

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
