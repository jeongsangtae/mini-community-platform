import { useState, useEffect, useRef, useContext } from "react";

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
  const [selectChatRoomUserName, setSelectChatRoomUserName] = useState("");
  const [updatedUsersData, setUpdatedUsersData] = useState([]);

  const userListContainerRef = useRef(null);
  const authCtx = useContext(AuthContext);

  console.log(usersData);
  console.log(updatedUsersData);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const combineUserData = usersData.map(async (user) => {
        const response = await fetch(
          "http://localhost:3000/admin/chat/" + user._id,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("메시지를 불러올 수 없습니다.");
        }

        const resData = await response.json();
        return { ...user, lastMessage: resData.message };
      });

      const usersWithMessages = await Promise.all(combineUserData);

      console.log(usersWithMessages);

      setUpdatedUsersData(usersWithMessages);
    };
    fetchLastMessages();

    // const interval = setInterval(fetchLastMessages, 5000);

    // return () => clearInterval(interval);
  }, [usersData]);

  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  const userChatRoomToggleHandler = () => {
    setUserChatRoomToggle(!userChatRoomToggle);
  };

  const chatRoomMoveHandler = (userId, name) => {
    setSelectUserChatRoom(userId);
    setSelectChatRoomUserName(name);
    userChatRoomToggleHandler();
  };

  return (
    <div className={classes.chat}>
      <div
        className={`${classes["user-list-container"]} ${
          classes[authCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        <ul className={classes["user-item"]} ref={userListContainerRef}>
          {updatedUsersData.map((userData) => (
            <AdminUserItem
              key={userData._id}
              userId={userData._id}
              name={userData.name}
              email={userData.email}
              lastMessageContent={userData.lastMessage?.content}
              lastMessageDate={userData.lastMessage?.date}
              selectUser={chatRoomMoveHandler}
            />
          ))}
        </ul>
      </div>

      <AdminChats
        userId={selectUserChatRoom}
        userName={selectChatRoomUserName}
        adminId={adminId}
        adminEmail={adminEmail}
        chatRoomToggle={userChatRoomToggle}
        chatRoomClose={userChatRoomToggleHandler}
        // usersData={usersData}
      />

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
