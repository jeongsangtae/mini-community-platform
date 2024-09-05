import ReactDOM from "react-dom";

import classes from "./Overlay.module.css";

const portalElement = document.getElementById("overlays");

const Overlay = ({ children, className, onClose }) => {
  return ReactDOM.createPortal(
    <div className={classes[`${className}`]} onClick={onClose}>
      {children}
    </div>,
    portalElement
  );
};

export default Overlay;
