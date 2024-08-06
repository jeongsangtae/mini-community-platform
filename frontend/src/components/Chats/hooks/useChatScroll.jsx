import { useState, useEffect, useRef } from "react";

const useChatScroll = (
  messages,
  chatToggle,
  userTypes = { user: "user", admin: "admin" }
) => {
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [toBottomButton, setToBottomButton] = useState(false);

  // 새로운 메시지가 추가되었을 때, 스크롤이 자동으로 최신 메시지로 이동
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (!chatContainer) return;

    // console.log(chatContainer);

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // 오차를 줄이기 위해서 -1 사용
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    // 스크롤이 거의 아래에 있을 때를 구하는 내용
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    const latestMessage = messages[messages.length - 1];

    if (isAtBottom) {
      // 스크롤이 맨 아래에 있는 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === userTypes.user) {
      // 사용자가 작성한 메시지가 추가된 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (nearBottom && latestMessage?.userType === userTypes.admin) {
      // 스크롤이 거의 아래에 있는 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === userTypes.admin) {
      // 관리자가 작성한 메시지가 추가된 경우
      setShowNewMessageButton(true);
      setToBottomButton(false);
    }
  }, [messages]);

  useEffect(() => {
    if (chatToggle) {
      scrollToBottomHandler();
    }
  }, [chatToggle]);

  const scrollToBottomHandler = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const scrollToNewMessagesHandler = () => {
    messagesEndRef.current?.scrollIntoView();
    setShowNewMessageButton(false); // 버튼 숨기기
  };

  const scrollHandler = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    // 오차를 줄이기 위해 -1을 사용
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (isAtBottom) {
      setToBottomButton(false);
      setShowNewMessageButton(false);
    } else if (!isAtBottom && !showNewMessageButton) {
      setToBottomButton(true);
    }
  };

  return {
    chatContainerRef,
    messagesEndRef,
    showNewMessageButton,
    toBottomButton,
    scrollToBottomHandler,
    scrollToNewMessagesHandler,
    scrollHandler,
  };
};

export default useChatScroll;
