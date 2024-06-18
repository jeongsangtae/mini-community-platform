import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import classes from "./AdminChats.module.css";
import AdminChat from "./AdminChat";

const AdminChats = ({ adminId, adminEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatToggle, setChatToggle] = useState(false);

  console.log(adminId, adminEmail);

  useEffect(() => {
    if (!adminId) {
      console.error("adminId가 정의되지 않았습니다.");
      return;
    }

    const fetchMessages = async () => {
      const response = await fetch(
        "http://localhost:3000/admin/chat/" + adminId,
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

  const sendMessage = async () => {
    const response = await fetch(
      "http://localhost:3000/admin/chat/" + adminId,
      {
        method: "POST",
        body: JSON.stringify({ message, adminEmail }),
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
          {messages.map((message) => (
            <AdminChat key={message._id} message={message.content} />
          ))}
        </ul>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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

export default AdminChats;
