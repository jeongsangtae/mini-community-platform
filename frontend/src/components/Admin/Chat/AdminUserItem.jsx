import { useState } from "react";
import AdminChats from "./AdminChats";

const AdminUserItem = ({ userId, name, email, adminId, adminEmail }) => {
  const [userChatRoom, setUserChatRoom] = useState(false);

  const userChatRoomMoveHandler = () => {
    setUserChatRoom(true);
  };

  return (
    <li>
      <button onClick={userChatRoomMoveHandler}>
        <div>{name}</div>
        <div>{email}</div>
      </button>
      {userChatRoom && (
        <AdminChats userId={userId} adminId={adminId} adminEmail={adminEmail} />
      )}
    </li>
  );
};

export default AdminUserItem;
