import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
// import { IoIosClose } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./Chat.module.css";

const Chat = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

  console.log(userId);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.on("message", (msg) => {
      console.log("서버로부터의 메시지:", msg);
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
      // throw json({ message: "메시지를 전송할 수 없습니다." }, { status: 500 });
      throw new Error("메시지를 전송할 수 없습니다.");
    } else {
      const resData = await response.json();
      console.log(resData.newChat);
    }
    // if (socket) {
    //   socket.emit("clientMessage", inputValue);
    // }
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const chatContainerToggleClass = chatToggle
    ? `${classes["chat-container"]} ${classes.open}`
    : `${classes["chat-container"]} ${classes.close}`;

  return (
    <div className={classes.chat}>
      {/* {chatToggle && ( */}
      {/* <div className={classes["chat-container"]}> */}
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
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

export default Chat;
