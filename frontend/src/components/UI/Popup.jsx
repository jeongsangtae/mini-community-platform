import React from "react";
import classes from "./Popup.module.css";

const Popup = ({ onClose }) => {
  return (
    <div className={classes.popup}>
      <h2 className={classes["popup-title"]}>관리자 페이지 계정 안내</h2>
      <div className={classes["popup-content"]}>
        <p>관리자 페이지 테스트를 위한 계정 안내</p>
        <p>아이디: admin@admin.com</p>
        <p>비밀번호: </p>
      </div>
      <div className={classes["popup-button"]}>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Popup;
