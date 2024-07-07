import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";

import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

import AdminUserItem from "./AdminUserItem";
import AdminChats from "./AdminChats";
import AuthContext from "../../../store/auth-context";
import classes from "./AdminUserList.module.css";

const AdminUserList = ({ adminId, adminEmail, usersData }) => {
  const [chatToggle, setChatToggle] = useState(false);
  const [userChatRoomToggle, setUserChatRoomToggle] = useState(false);
  const [selectUserChatRoom, setSelectUserChatRoom] = useState(null);
  const [lastMessageData, setLastMessageData] = useState(null);

  const authCtx = useContext(AuthContext);

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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://localhost:3000/admin/chat/" + userId,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("메시지를 불러올 수 없습니다.");
      }
      const resData = await response.json();
      console.log(resData);
      setLastMessageData(resData.message);
    };
    fetchData();
  }, []);

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const userChatRoomToggleHandler = () => {
    setUserChatRoomToggle(!userChatRoomToggle);
  };

  const chatRoomMoveHandler = (userId) => {
    setSelectUserChatRoom(userId);
    userChatRoomToggleHandler();
  };

  // const joinUserRoom = (userId) => {
  //   const roomId = `room-${userId}`;
  //   socket.emit("joinRoom", { userId, userType: "admin" });
  //   console.log(`관리자가 방 ${roomId}에 입장하였습니다.`);
  // };

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["user-list-container"]} ${
          classes[authCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        <ul className={classes["user-item"]}>
          {usersData.map((userData) => (
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

      {userChatRoomToggle && (
        <AdminChats
          userId={selectUserChatRoom}
          adminId={adminId}
          adminEmail={adminEmail}
          chatRoomToggle={userChatRoomToggle}
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
