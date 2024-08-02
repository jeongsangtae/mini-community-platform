import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import AuthContext from "../../store/auth-context";
import Chat from "./Chat";
import classes from "./Chats.module.css";
import ChatInput from "./ChatInput";

const Chats = ({ userId, userEmail }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emptyInput, setEmptyInput] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [toBottomButton, setToBottomButton] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(32); // 초기 높이 설정

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const authCtx = useContext(AuthContext);

  console.log(emptyInput);

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
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    // 스크롤이 거의 아래에 있을 때를 구하는 내용
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    const latestMessage = messages[messages.length - 1];

    if (isAtBottom) {
      // 스크롤이 맨 아래에 있는 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === "user") {
      // 사용자가 작성한 메시지가 추가된 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (nearBottom && latestMessage?.userType === "admin") {
      // 스크롤이 거의 아래에 있는 경우
      setShowNewMessageButton(false);
      setToBottomButton(false);
      scrollToBottomHandler();
    } else if (latestMessage?.userType === "admin") {
      // 관리자가 작성한 메시지가 추가된 경우
      setShowNewMessageButton(true);
      setToBottomButton(false);
    }
  }, [messages]);

  // 채팅 입력창이 늘어날 때, 채팅 내용이 보여지는 컨테이너가 줄어드는 내용
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const buttonsContainer = buttonsContainerRef.current;

    if (chatContainer) {
      chatContainer.style.height = `calc(100% - ${textareaHeight + 64}px)`;

      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isAtBottom) {
        scrollToBottomHandler();
      }
    }

    if (buttonsContainer) {
      buttonsContainer.style.bottom = `${textareaHeight + 56}px`;
    }
  }, [textareaHeight]);

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
    setTextareaHeight(32);
    textareaRef.current.style.height = "auto";
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

    // 오차를 줄이기 위해 -1을 사용
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (isAtBottom) {
      setToBottomButton(false);
      setShowNewMessageButton(false);
    } else if (!isAtBottom && !showNewMessageButton) {
      setToBottomButton(true);
    }
  };

  // const inputChangeHandler = (event) => {
  //   const textarea = textareaRef.current;
  //   setMessage(event.target.value);

  //   textarea.style.height = "auto"; // 높이를 초기화하여 scrollHeight 값을 올바르게 계산
  //   const newHeight = textarea.scrollHeight; // 새로운 높이 계산
  //   textarea.style.height = `${newHeight}px`;
  //   console.log(newHeight);

  //   // 최대 높이를 설정하고 그 이상은 스크롤
  //   if (newHeight <= 112) {
  //     textarea.style.height = `${newHeight}px`;
  //     setTextareaHeight(newHeight); // 새로운 높이 설정
  //   } else {
  //     textarea.style.height = "112px";
  //   }
  //   setEmptyInput(event.target.value.trim() === "");
  // };

  // const keyPressHandler = (event) => {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //     sendMessage();
  //   }
  // };

  // 채팅창을 다시 토글했을 때, 제일 밑으로 이동하는 버튼이 안보이게 구성
  const chatToggleHandler = () => {
    setChatToggle((prevToggle) => !prevToggle);
    if (!chatToggle) {
      setTimeout(() => {
        scrollToBottomHandler();
      }, 0); // Open 할 때 scrollToBottomHandler 호출
    }
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
              userType={message.userType}
            />
          ))}
          <div ref={messagesEndRef} />
        </ul>

        <div className={classes["buttons-container"]} ref={buttonsContainerRef}>
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
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
          textareaRef={textareaRef}
          emptyInput={emptyInput}
          setEmptyInput={setEmptyInput}
          setTextareaHeight={setTextareaHeight}
        />

        {/* <div
          className={`${classes["input-container"]} ${
            classes[authCtx.themeClass]
          }`}
        >
          <textarea
            type="text"
            value={message}
            onChange={inputChangeHandler}
            rows="1"
            onKeyDown={keyPressHandler}
            placeholder="메시지를 입력해주세요."
            ref={textareaRef}
          />

          <button
            onClick={sendMessage}
            className={
              emptyInput
                ? `${classes.disable} ${classes[authCtx.themeClass]}`
                : ""
            }
          >
            전송
          </button>
        </div> */}
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
