import { useState, useEffect, useRef, useContext } from "react";
import { BsChatFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";

import AdminUserItem from "./AdminUserItem";
import AdminChats from "./AdminChats";

import AuthContext from "../../../store/auth-context";
import UIContext from "../../../store/ui-context";
import classes from "./AdminUserList.module.css";

const AdminUserList = ({ adminId, adminEmail, usersData }) => {
  const authCtx = useContext(AuthContext);
  const uiCtx = useContext(UIContext);

  // 환경 변수에서 API URL 가져오기
  const apiURL = import.meta.env.VITE_API_URL;

  const [chatToggle, setChatToggle] = useState(false);
  const [userChatRoomToggle, setUserChatRoomToggle] = useState(false);
  const [selectUserChatRoom, setSelectUserChatRoom] = useState(null);
  const [selectChatRoomUserName, setSelectChatRoomUserName] = useState("");
  const [updatedUsersData, setUpdatedUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userListContainerRef = useRef(null);

  // 사용자 데이터와 마지막 메시지를 병합하여 상태를 업데이트하는 useEffect
  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        // 각 사용자의 마지막 메시지를 가져오는 비동기 작업
        const combineUserData = usersData.map(async (user) => {
          const response = await fetch(`${apiURL}/admin/chat/${user._id}`, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("마지막 메시지 조회 실패");
          }

          const resData = await response.json();
          return { ...user, lastMessage: resData.message };
        });

        // 모든 사용자의 메시지를 병합한 후 상태를 업데이트
        const usersWithMessages = await Promise.all(combineUserData);

        setUpdatedUsersData(usersWithMessages);
      } catch (error) {
        // 전체 fetchLastMessages 함수에서 발생하는 오류를 처리
        authCtx.errorHelper(
          error,
          "마지막 메시지를 불러오는 중에 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요."
        );
      }
    };

    fetchLastMessages();
  }, [usersData]);

  // 채팅 토글 핸들러
  const chatToggleHandler = () => {
    setChatToggle(!chatToggle);
  };

  // 사용자 채팅방 토글 핸들러
  const userChatRoomToggleHandler = () => {
    setUserChatRoomToggle(!userChatRoomToggle);
  };

  // 특정 사용자 채팅방으로 이동하는 함수
  const chatRoomMoveHandler = (userId, name) => {
    setSelectUserChatRoom(userId);
    setSelectChatRoomUserName(name);
    userChatRoomToggleHandler();
  };

  // 검색어에 따라 필터링된 사용자 목록 생성
  const filteredUsers = updatedUsersData.filter(
    (userData) =>
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.chat}>
      {/* 사용자 목록을 보여주는 컨테이너 */}
      <div
        className={`${classes["user-list-container"]} ${
          classes[uiCtx.themeClass]
        } ${chatToggle ? `${classes.open}` : `${classes.close}`}`}
      >
        {/* 사용자 검색 입력 필드 */}
        <div className={classes["search-container"]}>
          <IoIosSearch className={classes["search-icon"]} />
          <input
            type="text"
            className={`${classes["search-input"]} ${
              classes[uiCtx.themeClass]
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

      {/* 채팅 토글 버튼 */}
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
