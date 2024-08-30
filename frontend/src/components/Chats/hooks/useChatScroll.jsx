import { useState, useEffect, useRef } from "react";

const useChatScroll = (
  messages,
  userRoles = { self: "user", other: "admin" }
) => {
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [toBottomButton, setToBottomButton] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 새로운 메시지가 추가되었을 때, 스크롤 동작을 관리하는 로직
  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (!chatContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // 스크롤이 맨 아래에 있는지 확인 (오차를 줄이기 위해서 -1 사용)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    // 스크롤이 거의 맨 아래에 있는지 확인
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    const latestMessage = messages[messages.length - 1];

    if (isAtBottom) {
      // 스크롤이 맨 아래에 있는 경우, 새 메시지 알림 및 버튼을 숨김
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === userRoles.self) {
      // 본인이 작성한 메시지가 추가된 경우, 새 메시지 알림 및 버튼을 숨김
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (nearBottom && latestMessage?.userType === userRoles.other) {
      // 스크롤이 거의 아래에 있고 상대방이 메시지를 작성한 경우, 알림 및 버튼을 숨김
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === userRoles.other) {
      // 상대방이 작성한 메시지가 추가되었으나 스크롤이 맨 아래에 있지 않은 경우, 새 메시지 알림을 표시
      setShowNewMessageButton(true);
      setToBottomButton(false);
    }
  }, [messages]);

  // 맨 아래로 스크롤 이동 함수
  const scrollToBottomHandler = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  // 새 메시지로 스크롤 이동 함수
  const scrollToNewMessagesHandler = () => {
    messagesEndRef.current?.scrollIntoView();
    setShowNewMessageButton(false);
  };

  // 스크롤 동작에 따라 버튼 상태를 업데이트하는 함수
  const scrollHandler = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

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
