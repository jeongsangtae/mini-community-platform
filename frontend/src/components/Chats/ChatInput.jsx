import React, { useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./ChatInput.module.css";

const ChatInput = ({
  message,
  setMessage,
  onSendMessage,
  textareaRef,
  emptyInput,
  setEmptyInput,
  setTextareaHeight,
}) => {
  const authCtx = useContext(AuthContext);

  const inputChangeHandler = (event) => {
    const textarea = textareaRef.current;
    setMessage(event.target.value);

    textarea.style.height = "auto"; // 높이를 초기화하여 scrollHeight 값을 올바르게 계산
    const newHeight = textarea.scrollHeight; // 새로운 높이 계산
    textarea.style.height = `${newHeight}px`;
    console.log(newHeight);

    // 최대 높이를 설정하고 그 이상은 스크롤
    if (newHeight <= 112) {
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight); // 새로운 높이 설정
    } else {
      textarea.style.height = "112px";
    }
    setEmptyInput(event.target.value.trim() === "");
  };

  const keyPressHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div
      className={`${classes["input-container"]} ${classes[authCtx.themeClass]}`}
    >
      <textarea
        type="text"
        value={message}
        onChange={inputChangeHandler}
        rows="1"
        onKeyDown={keyPressHandler}
        placeholder="메시지를 입력해주세요."
        ref={textareaRef}
      />

      <button
        onClick={onSendMessage}
        className={
          emptyInput ? `${classes.disable} ${classes[authCtx.themeClass]}` : ""
        }
      >
        전송
      </button>
    </div>
  );
};

export default ChatInput;
