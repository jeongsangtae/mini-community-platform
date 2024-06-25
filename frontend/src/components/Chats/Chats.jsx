import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import AuthContext from "../../store/auth-context";
import Chat from "./Chat";
import classes from "./Chats.module.css";

const Chats = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [toBottomButton, setToBottomButton] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const authCtx = useContext(AuthContext);

  // console.log(messagesEndRef);

  // console.log(userId, userEmail);
  // console.log(messages);
  // console.log(emptyInput);
  console.log(authCtx.userInfo?._id);

  console.log(showNewMessageButton);

  // 저장된 기존 메시지 불러오기
  useEffect(() => {
    if (!userId) {
      console.error("userId가 정의되지 않았습니다.");
      return;
    }

    const fetchMessages = async () => {
      const response = await fetch("http://localhost:3000/chat/" + userId, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("메시지를 불러올 수 없습니다.");
      }
      const resData = await response.json();
      setMessages(resData.messages);
    };

    fetchMessages();
  }, [userId]);

  // WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true, // CORS 설정
    });

    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다:", newSocket.id);
      newSocket.emit("joinRoom", { userId, userType: "user" });
    });

    newSocket.on("newMessage", (newMessage) => {
      setMessages((prevMsg) => [...prevMsg, newMessage]);
      console.log("사용자 input 메시지: ", newMessage.content);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // 새로운 메시지가 추가되었을 때, 스크롤이 자동으로 최신 메시지로 이동
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

    const response = await fetch("http://localhost:3000/chat/" + userId, {
      method: "POST",
      // body: JSON.stringify({ message, userEmail }),
      body: JSON.stringify(newMessage),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
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

  const scrollToNewMessages = () => {
    messagesEndRef.current?.scrollIntoView();
    setShowNewMessageButton(false); // 버튼 숨기기
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // console.log(`scrollTop: ${scrollTop}`);
    // console.log(`clientHeight: ${clientHeight}`);
    // console.log(`scrollHeight: ${scrollHeight}`);

    // 오차를 줄이기 위해 -1을 사용
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setToBottomButton(false);
      // setShowNewMessageButton(false);
    } else {
      setToBottomButton(true);
      // setShowNewMessageButton(true);
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
    <div className={classes.chats}>
      <div
        className={`${classes["chats-container"]} ${
          classes[authCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        <ul
          className={classes["user-messages-container"]}
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((message) => (
            <Chat
              key={message._id}
              message={message.content}
              date={message.date}
            />
          ))}
          <div ref={messagesEndRef} />
        </ul>
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

export default Chats;
