import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./Chats.module.css";
import Chat from "./Chat";

const Chats = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(false);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  console.log(messagesEndRef);

  console.log(userId, userEmail);
  console.log(messages);

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
    });

    newSocket.on("newMessage", (newMessage) => {
      setMessages((prevMsg) => [...prevMsg, newMessage]);
      console.log("사용자 input 메시지: ", newMessage.content);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 새로운 메시지가 추가되었을 때, 스크롤이 자동으로 최신 메시지로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") {
      setError(true);
      return;
    }

    const response = await fetch("http://localhost:3000/chat/" + userId, {
      method: "POST",
      body: JSON.stringify({ message, userEmail }),
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
    setError(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNewMessages = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessageButton(false); // 버튼 숨기기
  };

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    console.log(`scrollTop: ${chatContainer.scrollTop}`);
    console.log(`clientHeight: ${chatContainer.clientHeight}`);
    console.log(`scrollHeight: ${chatContainer.scrollHeight}`);
    if (
      chatContainer.scrollTop + chatContainer.clientHeight <
      chatContainer.scrollHeight
    ) {
      setShowNewMessageButton(true);
    } else {
      setShowNewMessageButton(false);
    }
  };

  const inputChangeHandler = (event) => {
    // setMessage(event.target.value);
    // if (error) {
    //   setError(false);
    // }
    if (setMessage(event.target.value) !== "") {
      setError(false);
    }
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  return (
    <div className={classes.chats}>
      {/* {chatToggle && ( */}
      {/* <div className={classes["chat-container"]}> */}
      <div
        className={`${classes["chats-container"]} ${
          chatToggle ? `${classes.open}` : `${classes.close}`
        }`}
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
        <div className={classes["input-container"]}>
          <input
            type="text"
            value={message}
            // onChange={(e) => setMessage(e.target.value)}
            onChange={inputChangeHandler}
            placeholder="메시지를 입력해주세요."
            className={error ? classes["input-error"] : ""}
          />

          <button onClick={sendMessage} className={classes["send-button"]}>
            전송
          </button>
        </div>
      </div>
      {/* )} */}
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
        {/* <BsChatFill
           onClick={chatToggleHandler}
           className={`${classes["chat-fill"]} ${
            chatToggle ? `${classes.hide}` : `${classes.show}`
          }`}
        />
         <IoIosArrowDown
           onClick={chatToggleHandler}
           className={`${classes["arrow-down"]} ${
             chatToggle ? `${classes.show}` : `${classes.hide}`
           }`}
         /> */}
      </div>
    </div>
  );
};

export default Chats;
