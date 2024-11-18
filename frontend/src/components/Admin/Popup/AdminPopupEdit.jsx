import { useState, useContext } from "react";

import Modal from "../../UI/Modal";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminPopupEdit.module.css";

const AdminPopupEdit = ({ onPopupEditToggle }) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  const apiURL = import.meta.env.VITE_API_URL;

  const [popupData, setPopupData] = useState({
    title: "",
    content: "",
    active: false,
  });

  const popupChangeHandler = (event) => {
    const { name, type, checked, value } = event.target;
    setPopupData({
      ...popupData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiURL}/admin/popup`, {
        method: "PATCH",
        body: JSON.stringify(popupData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`팝업 수정 실패`);
      }
    } catch (error) {
      authCtx.errorHelper(
        error,
        "팝업 수정 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }

    onPopupEditToggle();
  };

  const titleEnterKeyPreventHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <Modal onClose={onPopupEditToggle}>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.header}>
          <h2>팝업 수정</h2>
          <div className={classes.active}>
            <div className={classes["active-mode"]}>팝업 활성화</div>
            <label htmlFor="active" className={classes["active-item"]}>
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={popupData.active}
                onChange={popupChangeHandler}
              />
              <span
                className={`${classes["active-slider"]} ${
                  classes[uiCtx.themeClass]
                }`}
              ></span>
            </label>
          </div>
        </div>

        <div className={classes.input}>
          <input
            required
            type="text"
            id="title"
            name="title"
            value={popupData.title}
            maxLength={20}
            onChange={popupChangeHandler}
            onKeyDown={titleEnterKeyPreventHandler}
            placeholder="제목 입력"
          />
        </div>

        <div className={classes.textarea}>
          <textarea
            required
            name="content"
            value={popupData.content}
            onChange={popupChangeHandler}
            rows="5"
            placeholder="내용 입력"
          />
        </div>

        <div className={`${classes.buttons} ${classes[uiCtx.themeClass]}`}>
          <button>등록</button>
          <button onClick={onPopupEditToggle}>취소</button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminPopupEdit;
