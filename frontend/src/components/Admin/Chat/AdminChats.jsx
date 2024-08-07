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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);

  const textareaRef = useRef(null);

  const authCtx = useContext(AuthContext);

  const {
    chatContainerRef,
    messagesEndRef,
    showNewMessageButton,
    toBottomButton,
    scrollToBottomHandler,
    scrollToNewMessagesHandler,
    scrollHandler,
  } = useChatScroll(messages, { self: "admin", other: "user" });

  const { setTextareaHeight, buttonsContainerRef } = useAutosizeChatHeight(
    chatContainerRef,
    scrollToBottomHandler,
    { chatContainerHeight: 92 }
  );

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
      const userId = chatRoomId;
      const response = await fetch(
        "http://localhost:3000/admin/chat/" + adminId + "/" + userId,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("메시지를 불러올 수 없습니다.");
      }
      const resData = await response.json();
      setMessages(resData.messages);
    };

    fetchMessages();
  }, [adminId, chatRoomId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", { withCredentials: true });

    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다.", newSocket.id);
    });

    newSocket.on("newMessage", (newMessage) => {
      setMessages((prevMsg) => [...prevMsg, newMessage]);
      console.log("관리자 input 메시지: ", newMessage.content);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !chatRoomId) return;

    if (chatRoomId) {
      const userId = chatRoomId;
      joinUserRoom(userId);
    }
  }, [socket, chatRoomId]);

  const joinUserRoom = (userId) => {
    if (!socket) {
      console.error("Socket이 초기화되지 않았습니다.");
      return;
    }

    const roomId = `room-${userId}`;
    socket.emit("joinRoom", { userId, userType: "admin" });
    console.log(`관리자가 방 ${roomId}에 입장하였습니다.`);
  };

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
      throw new Error("메시지를 전송할 수 없습니다.");
    } else {
      const resData = await response.json();
      console.log(resData.newMessage);
    }
    setMessage("");
    setEmptyInput(true);
    setTextareaHeight(32);
    textareaRef.current.style.height = "auto";
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
