import { useState, useContext } from "react";

import Modal from "../../UI/Modal";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminPopupEdit.module.css";

const AdminPopupEdit = ({ onPopupEditToggle }) => {
  const authCtx = useContext(AuthContext);

  const apiURL = import.meta.env.VITE_API_URL;

  const [popupData, setPopupData] = useState({
    title: "",
    content: "",
  });

  console.log(popupData);

  const popupChangeHandler = (event) => {
    const { name, value } = event.target;
    setPopupData({ ...popupData, [name]: value });
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

  return (
    <Modal onClose={onPopupEditToggle}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h2>팝업 수정</h2>
        <div className={classes.input}>
          <input
            type="text"
            id="title"
            name="title"
            value={popupData.title}
            maxLength={15}
            onChange={popupChangeHandler}
            placeholder="제목 입력"
          />
        </div>

        <div className={classes.textarea}>
          <textarea
            name="content"
            value={popupData.content}
            onChange={popupChangeHandler}
            placeholder="내용 입력"
          />
        </div>

        <div>
          <button>등록</button>
          <button onClick={onPopupEditToggle}>취소</button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminPopupEdit;
