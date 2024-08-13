import { useState, useEffect, useRef, useContext } from "react";

import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";

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
  const [searchTerm, setSearchTerm] = useState("");

  const userListContainerRef = useRef(null);
  const authCtx = useContext(AuthContext);

  // 사용자 데이터와 마지막 메시지를 병합하여 상태를 업데이트하는 useEffect
  useEffect(() => {
    const fetchLastMessages = async () => {
      const combineUserData = usersData.map(async (user) => {
        // 각 사용자의 마지막 메시지를 가져오는 비동기 작업
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

      // 모든 사용자의 메시지를 병합한 후 상태를 업데이트
      const usersWithMessages = await Promise.all(combineUserData);

      setUpdatedUsersData(usersWithMessages);
    };
    fetchLastMessages();
  }, [usersData]);

  // 채팅 창 토글 핸들러
  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  // 사용자 채팅방 토글 핸들러
  const userChatRoomToggleHandler = () => {
    setUserChatRoomToggle(!userChatRoomToggle);
  };

  // 특정 사용자 채빙방으로 이동하는 함수
  const chatRoomMoveHandler = (userId, name) => {
    setSelectUserChatRoom(userId);
    setSelectChatRoomUserName(name);
    userChatRoomToggleHandler();
  };

  // 검색어에 따라 필터링된 사용자 목록 생성
  const filteredUsers = updatedUsersData.filter((userData) =>
    userData.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.chat}>
      {/* 사용자 목록을 보여주는 컨테이너 */}
      <div
        className={`${classes["user-list-container"]} ${
          classes[authCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        {/* 사용자 검색 입력 필드 */}
        <div className={classes["search-container"]}>
          <IoIosSearch className={classes["search-icon"]} />
          <input
            type="text"
            className={`${classes["search-input"]} ${
              classes[authCtx.themeClass]
            }`}
            placeholder="사용자 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 사용자 목록 렌더링 */}
        <ul className={classes["user-item"]} ref={userListContainerRef}>
          {filteredUsers.map((userData) => (
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

      {/* 선택된 사용자와의 채팅 창 */}
      <AdminChats
        userId={selectUserChatRoom}
        userName={selectChatRoomUserName}
        adminId={adminId}
        adminEmail={adminEmail}
        chatRoomToggle={userChatRoomToggle}
        chatRoomClose={userChatRoomToggleHandler}
      />

      {/* 채팅 창 토글 버튼 */}
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
