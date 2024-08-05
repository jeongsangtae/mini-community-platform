import { useState, useEffect, useRef } from "react";

const useAutosizeChatHeight = (chatContainerRef, scrollToBottomHandler) => {
  const [textareaHeight, setTextareaHeight] = useState(32); // 초기 높이 설정

  const buttonsContainerRef = useRef(null);

  // 채팅 입력창이 늘어날 때, 채팅 내용이 보여지는 컨테이너가 줄어드는 내용
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const buttonsContainer = buttonsContainerRef.current;

    if (chatContainer) {
      chatContainer.style.height = `calc(100% - ${textareaHeight + 64}px)`;

      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isAtBottom) {
        scrollToBottomHandler();
      }
    }

    if (buttonsContainer) {
      buttonsContainer.style.bottom = `${textareaHeight + 56}px`;
    }
  }, [textareaHeight]);

  return {
    textareaHeight,
    setTextareaHeight,
    buttonsContainerRef,
  };
};

export default useAutosizeChatHeight;
