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

    // 높이를 초기화하여 scrollHeight 값을 올바르게 계산
    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight; // 새로운 높이 계산
    textarea.style.height = `${newHeight}px`;

    // 텍스트 입력창의 최대 높이를 설정하고, 그 이상은 스크롤 사용
    if (newHeight <= 112) {
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight); // 부모 컴포넌트에 높이 업데이트
    } else {
      textarea.style.height = "112px";
    }

    // 입력된 값이 공백인지 확인하여 전송 버튼 활성화/비활성화
    setEmptyInput(event.target.value.trim() === "");
  };

  // Enter 키를 누르고 Shift 키가 함께 눌리지 않는 경우 메시지 전송
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
