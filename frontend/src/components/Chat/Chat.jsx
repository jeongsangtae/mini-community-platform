import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);

  // socket.emit("message", "socket.io 체크");

  console.log(messages);
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
    if (inputValue.trim() !== "") {
      socket.emit("message", inputValue);
      // setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div>
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
  );
};

export default Chat;
