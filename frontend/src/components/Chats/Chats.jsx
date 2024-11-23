import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import Chat from "./Chat";
import ChatInput from "./ChatInput";

import useChatScroll from "./hooks/useChatScroll";
import useAutosizeChatHeight from "./hooks/useAutosizeChatHeight";
import AuthContext from "../../store/auth-context";
import UIContext from "../../store/ui-context";
import classes from "./Chats.module.css";

const Chats = ({ userId, userEmail }) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);
  const [chatToggle, setChatToggle] = useState(false);

  const textareaRef = useRef(null);

  // 커스텀 훅을 사용하여 채팅 스크롤 관리
  const {
    chatContainerRef,
    messagesEndRef,
    showNewMessageButton,
    toBottomButton,
    scrollToBottomHandler,
    scrollToNewMessagesHandler,
    scrollHandler,
  } = useChatScroll(messages, { self: "user", other: "admin" });

  // 커스텀 훅을 사용하여 채팅 입력창의 크기 자동 조절
  const { setTextareaHeight, buttonsContainerRef } = useAutosizeChatHeight(
    chatContainerRef,
    scrollToBottomHandler,
    { chatContainerHeight: 64 }
  );

  // 저장된 기존 메시지 불러오기
  useEffect(() => {
    if (!userId) {
      console.error("userId가 정의되지 않았습니다.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiURL}/chat/${userId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("메시지 조회 실패");
        }

        const resData = await response.json();

        setMessages(resData.messages);
      } catch (error) {
        authCtx.errorHelper(
          error,
          "메시지를 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
    };

    fetchMessages();
  }, [userId]);

  // WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    try {
      const newSocket = io(`${apiURL}`, {
        withCredentials: true, // CORS 설정
      });

      newSocket.on("connect", () => {
        console.log("서버에 연결되었습니다:", newSocket.id);
        newSocket.emit("joinRoom", { userId, userType: "user" });
      });

      // 서버로부터 새로운 메시지를 받을 때마다 메시지 목록에 추가
      newSocket.on("newMessage", (newMessage) => {
        setMessages((prevMsg) => [...prevMsg, newMessage]);
        console.log("사용자 input 메시지: ", newMessage.content);
      });

      setSocket(newSocket);

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      authCtx.errorHelper(
        error,
        "서버와의 연결 중 오류가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  }, [userId]);

  // 메시지 전송 함수
  const sendMessageHandler = async () => {
    if (!userId) {
      console.error("userId가 정의되지 않았습니다.");
      return;
    }

    if (message.trim() === "") {
      setEmptyInput(true);
      return;
    }

    const newMessage = {
      userId: authCtx.userInfo._id,
      userEmail,
      content: message,
      userType: "user",
    };

    try {
      // 서버로 메시지를 POST 요청으로 전송
      const response = await fetch(`${apiURL}/chat/${userId}`, {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("메시지 전송 실패");
      }

      console.log("메시지 전송 성공");

      // 전송 후 입력 필드와 높이 초기화
      setMessage("");
      setEmptyInput(true);
      setTextareaHeight(32);
      textareaRef.current.style.height = "auto";
    } catch (error) {
      authCtx.errorHelper(
        error,
        "메시지를 전송하는 데 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
      );
    }
  };

  // 채팅창을 열고 닫을 때, 스크롤이 제일 밑으로 이동하고 버튼 숨김
  const chatToggleHandler = () => {
    setChatToggle((prevToggle) => !prevToggle);
    if (!chatToggle) {
      setTimeout(() => {
        scrollToBottomHandler();
      }, 0); // Open 할 때 scrollToBottomHandler 호출
    }
  };

  return (
    <div className={classes.chats}>
      <div
        className={`${classes["chats-container"]} ${
          classes[uiCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        <ul
          className={classes["user-messages-container"]}
          ref={chatContainerRef}
          onScroll={scrollHandler}
        >
          {messages.map((message) => (
            <Chat
              key={message._id}
              message={message.content}
              date={message.date}
              userType={message.userType}
            />
          ))}
          <div ref={messagesEndRef} />
        </ul>

        <div className={classes["buttons-container"]} ref={buttonsContainerRef}>
          {showNewMessageButton && (
            <button
              onClick={scrollToNewMessagesHandler}
              className={classes["new-message-button"]}
            >
              새로운 메시지
            </button>
          )}

          {toBottomButton && (
            <IoIosArrowDown
              onClick={scrollToBottomHandler}
              className={classes["bottom-button"]}
            />
          )}
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessageHandler}
          textareaRef={textareaRef}
          emptyInput={emptyInput}
          setEmptyInput={setEmptyInput}
          setTextareaHeight={setTextareaHeight}
        />
      </div>

      <div className={classes["chat-icon"]}>
        {!chatToggle ? (
          <BsChatFill
            onClick={chatToggleHandler}
            className={classes["chat-fill"]}
          />
        ) : (
          <IoIosArrowDown
            onClick={chatToggleHandler}
            className={classes["arrow-down"]}
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
