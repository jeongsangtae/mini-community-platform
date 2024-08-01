import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

import AuthContext from "../../../store/auth-context";
import AdminChat from "./AdminChat";
import classes from "./AdminChats.module.css";

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
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [toBottomButton, setToBottomButton] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(32);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    // if (!usersData) {
    //   console.error("adminId가 정의되지 않았습니다.");
    //   return;
    // }

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

  useEffect(() => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    const latestMessage = messages[messages.length - 1];

    if (isAtBottom) {
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === "admin") {
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (nearBottom && latestMessage?.userType === "user") {
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === "user") {
      setShowNewMessageButton(true);
      setToBottomButton(false);
    }
  }, [messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const buttonsContainer = buttonsContainerRef.current;

    if (chatContainer) {
      chatContainer.style.height = `calc(100% - ${textareaHeight + 92}px)`;
      scrollToBottomHandler();
    }

    if (buttonsContainer) {
      buttonsContainer.style.bottom = `${textareaHeight + 56}px`;
    }
  }, [textareaHeight]);

  const sendMessage = async () => {
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

  const scrollToBottomHandler = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const scrollToNewMessages = () => {
    messagesEndRef.current?.scrollIntoView();
    setShowNewMessageButton(false); // 버튼 숨기기
  };

  const handleScroll = () => {
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

  const inputChangeHandler = (event) => {
    const textarea = textareaRef.current;
    setMessage(event.target.value);

    textarea.style.height = "auto";

    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;

    if (newHeight <= 112) {
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    } else {
      textarea.style.height = "112px";
    }
    setEmptyInput(event.target.value.trim() === "");
  };

  const keyPressHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
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
          onScroll={handleScroll}
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
              onClick={scrollToNewMessages}
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

        <div
          className={`${classes["input-container"]} ${
            classes[authCtx.themeClass]
          }`}
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
            onClick={sendMessage}
            className={
              emptyInput
                ? `${classes.invisible} ${classes[authCtx.themeClass]}`
                : ""
            }
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChats;
