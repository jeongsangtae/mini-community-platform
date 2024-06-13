import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
// import { IoIosClose } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./Chats.module.css";
import Chat from "./Chat";

const Chats = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

  console.log(userId, userEmail);

  useEffect(() => {
    // const newSocket = io("http://localhost:3001");

    const newSocket = io("http://localhost:3000", {
      withCredentials: true, // CORS 설정
    });

    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다:", newSocket.id);
    });

    // newSocket.on("message", (msg) => {
    //   console.log("서버로부터의 메시지:", msg);
    // });

    newSocket.on("serverResponse", (msg) => {
      console.log("서버로부터의 메시지:", msg);
      setServerMessage(msg); // 서버의 응답 메시지를 상태로 저장
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // const sendMessage = async () => {
  //   const response = await fetch("http://localhost:3000/chat/" + userId, {
  //     method: "POST",
  //     body: JSON.stringify({ message, userEmail }),
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   });
  //   if (!response.ok) {
  //     throw new Error("메시지를 전송할 수 없습니다.");
  //   } else {
  //     const resData = await response.json();
  //     console.log(resData.newChat);
  //   }
  //   // if (socket) {
  //   //   socket.emit("clientMessage", inputValue);
  //   // }
  // };

  const testButton = () => {
    if (socket) {
      socket.emit("testMessage", "테스트 메시지"); // 서버로 메시지 전송
    }
  };

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const chatContainerToggleClass = chatToggle
    ? `${classes["chat-container"]} ${classes.open}`
    : `${classes["chat-container"]} ${classes.close}`;

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
          {messages.map((message, index) => (
            // <li key={index}>{message}</li>
            <Chat key={index} message={message} />
          ))}
        </ul>
        <div className={classes["input-container"]}>
          {/* <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          /> */}

          {/* <button onClick={sendMessage} className={classes["send-button"]}>
            Send
          </button> */}
          <button onClick={testButton}>Socket.io 테스트</button>
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
