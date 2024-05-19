import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
// import { IoIosClose } from "react-icons/io";
import { MdCancel } from "react-icons/md";

import classes from "./Chat.module.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

  // socket.emit("message", "socket.io 체크");
  useEffect(() => {
    const socket = io("http://localhost:3001");
    // socket.on("message", (msg) => {
    //   // setMessages((prevMessages) => [...prevMessages, inputValue]);
    //   setMessages((prevMessages) => [...prevMessages, msg]);
    // });

    socket.on("message", (msg) => {
      console.log("서버로부터의 메시지:", msg);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // if (inputValue.trim() !== "") {
    //   socket.emit("message", inputValue);
    //   // setMessages([...messages, inputValue]);
    //   setInputValue("");
    // }

    if (socket) {
      socket.emit("clientMessage", inputValue);
    }
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const chatContainerToggleClass = chatToggle
    ? `${classes["chat-container"]} ${classes.open}`
    : `${classes["chat-container"]} ${classes.close}`;

  return (
    <div className={classes.chat}>
      {chatToggle && (
        <div className={classes["chat-container"]}>
          {/* <div
        className={`${classes["chat-container"]} ${
          chatToggle ? `${classes.open}` : `${classes.close}`
        }`}
      > */}
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
      )}
      <div className={classes["chat-icon"]}>
        <BsChatFill onClick={chatToggleHandler} />
      </div>
    </div>
  );
};

export default Chat;
