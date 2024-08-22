import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

import AuthContext from "../../../store/auth-context";
import useChatScroll from "../../Chats/hooks/useChatScroll";
import useAutosizeChatHeight from "../../Chats/hooks/useAutosizeChatHeight";
import AdminChat from "./AdminChat";
import classes from "./AdminChats.module.css";
import ChatInput from "../../Chats/ChatInput";

const AdminChats = ({
  adminId,
  adminEmail,
  userId: chatRoomId,
  userName,
  chatRoomToggle,
  chatRoomClose,
}) => {
  // 메시지 입력 상태, 메시지 목록, socket, 입력 필드 상태를 관리하기 위한 상태 설정
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);

  const textareaRef = useRef(null);

  const authCtx = useContext(AuthContext);

  // 커스텀 훅을 사용하여 채팅 스크롤 관리
  const {
    chatContainerRef,
    messagesEndRef,
    showNewMessageButton,
    toBottomButton,
    scrollToBottomHandler,
    scrollToNewMessagesHandler,
    scrollHandler,
  } = useChatScroll(messages, { self: "admin", other: "user" });

  // 커스텀 훅을 사용하여 채팅 입력창의 크기 자동 조절
  const { setTextareaHeight, buttonsContainerRef } = useAutosizeChatHeight(
    chatContainerRef,
    scrollToBottomHandler,
    { chatContainerHeight: 92 }
  );

  // 컴포넌트 마운트 시 메시지 로드 및 소켓 초기화
  // 저장된 기존 메시지 불러오기
  useEffect(() => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    if (!chatRoomId) {
      console.error("chatRoomId가 정의되지 않았습니다.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const userId = chatRoomId;
        const response = await fetch(
          "http://localhost:3000/admin/chat/" + adminId + "/" + userId,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("메시지 로드 중 오류 발생");
        }

        const resData = await response.json();
        setMessages(resData.messages);
      } catch (error) {
        authCtx.errorHelper(
          error,
          "메시지를 불러오는 데 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
    };

    fetchMessages();
  }, [adminId, chatRoomId]);

  // WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    try {
      const newSocket = io("http://localhost:3000", { withCredentials: true });

      newSocket.on("connect", () => {
        console.log("서버에 연결되었습니다.", newSocket.id);
      });

      // 서버로부터 새로운 메시지를 받을 때마다 메시지 목록에 추가
      newSocket.on("newMessage", (newMessage) => {
        setMessages((prevMsg) => [...prevMsg, newMessage]);
        console.log("관리자 input 메시지: ", newMessage.content);
      });

      setSocket(newSocket);

      // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      authCtx.errorHelper(
        error,
        "서버와의 연결 중 오류가 발생했습니다. 페이지를 새로고침 해보세요."
      );
    }
  }, []);

  // 사용자가 방에 입장할 때 방 참여 이벤트 실행
  useEffect(() => {
    if (!socket || !chatRoomId) return;

    if (chatRoomId) {
      const userId = chatRoomId;
      joinUserRoom(userId);
    }
  }, [socket, chatRoomId]);

  // 특정 사용자의 채팅방에 참여하는 함수
  const joinUserRoom = (userId) => {
    if (!socket) {
      console.error("Socket이 초기화되지 않았습니다.");
      return;
    }

    const roomId = `room-${userId}`;
    socket.emit("joinRoom", { userId, userType: "admin" });
    console.log(`관리자가 방 ${roomId}에 입장하였습니다.`);
  };

  // 메시지 전송 함수
  const sendMessageHandler = async () => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    if (message.trim() === "") {
      setEmptyInput(true);
      return;
    }

    const newMessage = {
      userId: chatRoomId,
      userName,
      adminEmail,
      content: message,
      userType: "admin",
    };

    try {
      // 서버로 메시지를 POST 요청으로 전송
      const response = await fetch(
        "http://localhost:3000/admin/chat/" + adminId,
        {
          method: "POST",
          body: JSON.stringify(newMessage),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("메시지를 전송 실패");
      } else {
        const resData = await response.json();
        console.log(resData.newMessage);
      }

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

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["chats-container"]} ${
          classes[authCtx.themeClass]
        } ${chatRoomToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        <div
          className={`${classes["chat-room-header"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          <FaArrowLeftLong onClick={chatRoomClose} />
          <div>{userName}</div>
        </div>
        <ul
          className={classes["admin-messages-container"]}
          ref={chatContainerRef}
          onScroll={scrollHandler}
        >
          {messages.map((message) => (
            <AdminChat
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
    </div>
  );
};

export default AdminChats;
