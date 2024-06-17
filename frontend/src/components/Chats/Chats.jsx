import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./Chats.module.css";
import Chat from "./Chat";

const Chats = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

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

  const sendMessage = async () => {
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
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  // const chatContainerToggleClass = chatToggle
  //   ? `${classes["chat-container"]} ${classes.open}`
  //   : `${classes["chat-container"]} ${classes.close}`;

  return (
    <div className={classes.chats}>
      {/* {chatToggle && ( */}
      {/* <div className={classes["chat-container"]}> */}
      <div
        className={`${classes["chats-container"]} ${
          chatToggle ? `${classes.open}` : `${classes.close}`
        }`}
      >
        <ul>
          {messages.map((message) => (
            <Chat key={message._id} message={message.content} />
          ))}
        </ul>
        <div className={classes["input-container"]}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={sendMessage} className={classes["send-button"]}>
            Send
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
