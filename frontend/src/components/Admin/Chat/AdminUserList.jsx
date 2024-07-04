import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import AdminUserItem from "./AdminUserItem";
import AdminChats from "./AdminChats";
import classes from "./AdminUserList.module.css";

const AdminUserList = ({ adminId, adminEmail, usersData }) => {
  const [chatToggle, setChatToggle] = useState(false);
  const [selectUserChatRoom, setSelectUserChatRoom] = useState(null);

  console.log(usersData);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", { withCredentials: true });

    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다.", newSocket.id);
    });

    // newSocket.on("newMessage", (newMessage) => {
    //   setMessages((prevMsg) => [...prevMsg, newMessage]);
    //   console.log("관리자 input 메시지: ", newMessage.content);
    // });

    // setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const joinUserRoom = (userId) => {
    const roomId = `room-${userId}`;
    socket.emit("joinRoom", { userId, userType: "admin" });
    console.log(`관리자가 방 ${roomId}에 입장하였습니다.`);
  };

  const chatRoomMoveHandler = (userId) => {
    setSelectUserChatRoom(userId);
  };

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["user-list-container"]} ${
          chatToggle ? `${classes.open}` : `${classes.close}`
        }`}
      >
        <ul>
          {usersData.map((userData) => (
            // <button key={user._id} onClick={() => joinUserRoom(user._id)}>
            //   {user.email}
            // </button>
            <AdminUserItem
              key={userData._id}
              userId={userData._id}
              name={userData.name}
              email={userData.email}
              selectUser={chatRoomMoveHandler}
            />
          ))}
        </ul>
      </div>

      {selectUserChatRoom && (
        <AdminChats
          userId={selectUserChatRoom}
          adminId={adminId}
          adminEmail={adminEmail}
        />
      )}

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

export default AdminUserList;
