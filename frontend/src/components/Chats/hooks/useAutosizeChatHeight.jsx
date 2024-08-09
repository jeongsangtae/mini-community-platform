import { useState, useEffect, useRef } from "react";

const useAutosizeChatHeight = (
  chatContainerRef,
  scrollToBottomHandler,
  offset = { chatContainerHeight: 64 }
) => {
  const [textareaHeight, setTextareaHeight] = useState(32);

  const buttonsContainerRef = useRef(null);

  // 채팅 입력창이 늘어날 때, 채팅 내용이 보여지는 컨테이너가 줄어드는 내용
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const buttonsContainer = buttonsContainerRef.current;

    if (chatContainer) {
      // 텍스트 입력창 높이에 따라 채팅 컨테이너 높이 조정
      chatContainer.style.height = `calc(100% - ${
        textareaHeight + offset.chatContainerHeight
      }px)`;

      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isAtBottom) {
        scrollToBottomHandler();
      }
    }

    if (buttonsContainer) {
      // 텍스트 입력창 높이에 따라 버튼 컨테이너 위치를 조정
      buttonsContainer.style.bottom = `${textareaHeight + 56}px`;
    }
  }, [textareaHeight]);

  return {
    setTextareaHeight,
    buttonsContainerRef,
  };
};

export default useAutosizeChatHeight;
