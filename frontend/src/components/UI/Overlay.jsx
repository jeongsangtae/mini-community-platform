import ReactDOM from "react-dom";

import classes from "./Overlay.module.css";

const ModalOverlay = ({ className, onClick, children }) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Overlay = ({ children, className, onClose }) => {
  return ReactDOM.createPortal(
    // <ModalOverlay className={classes.overlay} onClick={onClose}>
    //   {children}
    // </ModalOverlay>,
    // portalElement

    <div className={classes[`${className}`]} onClick={onClose}>
      {children}
    </div>,
    portalElement
  );
};

export default Overlay;
