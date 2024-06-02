import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./AdminChat.module.css";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("message", (msg) => {
      console.log("서버로부터의 메시지:", msg);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("clientMessage", inputValue);
    }
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["chat-container"]} ${
          chatToggle ? `${classes.open}` : `${classes.close}`
        }`}
      >
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
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

export default AdminChat;
