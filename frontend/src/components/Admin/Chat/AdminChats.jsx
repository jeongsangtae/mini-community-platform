import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import AuthContext from "../../../store/auth-context";
import classes from "./AdminChats.module.css";
import AdminChat from "./AdminChat";

const AdminChats = ({ adminId, adminEmail, usersData }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);
  const [toBottomButton, setToBottomButton] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const authCtx = useContext(AuthContext);

  console.log(adminId, adminEmail, usersData);

  useEffect(() => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    if (!usersData) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    const fetchMessages = async () => {
      const userId = usersData[0]._id;
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
  }, [adminId]);

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
    if (!socket || !usersData) return;

    if (usersData.length > 0) {
      const testUserId = usersData[0]._id;
      joinUserRoom(testUserId);
    }
  }, [socket, usersData]);

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
    // 오차를 줄이기 위해서 -1 사용
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      // setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else {
      scrollToBottomHandler();
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    if (message.trim() === "") {
      setEmptyInput(true);
      return;
    }

    const testNewMessage = {
      userId: usersData[0]._id,
      adminEmail,
      content: message,
      userType: "admin",
    };

    const response = await fetch(
      "http://localhost:3000/admin/chat/" + adminId,
      {
        method: "POST",
        // body: JSON.stringify({ message, adminEmail }),
        body: JSON.stringify(testNewMessage),
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
  };

  const scrollToBottomHandler = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    // 오차를 줄이기 위해 -1을 사용
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setToBottomButton(false);
    } else {
      setToBottomButton(true);
    }
  };

  const inputChangeHandler = (event) => {
    const value = event.target.value;
    setMessage(value);
    setEmptyInput(value.trim() === "");
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["chats-container"]} ${
          classes[authCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
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

        {toBottomButton && (
          <IoIosArrowDown
            onClick={scrollToBottomHandler}
            className={classes["bottom-button"]}
          />
        )}

        <div
          className={`${classes["input-container"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          <input
            type="text"
            value={message}
            onChange={inputChangeHandler}
            placeholder="메시지를 입력해주세요."
          />

          <button
            onClick={sendMessage}
            className={emptyInput ? `${classes.opacity}` : ""}
          >
            전송
          </button>
        </div>
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

export default AdminChats;
