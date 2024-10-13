import ReactDOM from "react-dom";
import { useEffect, useContext } from "react";

import UIContext from "../../store/ui-context";

import classes from "./Overlay.module.css";

const portalElement = document.getElementById("overlays");

const Overlay = ({ children, className, onClose }) => {
  const uiCtx = useContext(UIContext);

  useEffect(() => {
    uiCtx.modalChecked();

    return () => uiCtx.modalChecked();
  }, [uiCtx]);

  return ReactDOM.createPortal(
    <div className={classes[`${className}`]} onClick={onClose}>
      {children}
    </div>,
    portalElement
  );
};

export default Overlay;
