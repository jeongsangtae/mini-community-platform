const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

// 특정 유저의 마지막 채팅 메시지를 가져오는 라우트
router.get("/admin/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let userId = req.params.userId;

  userId = new ObjectId(userId);

  // 해당 유저의 마지막 채팅 메시지를 날짜 기준으로 내림차순 정렬하여 하나 가져옴
  const lastMessage = await db
    .getDb()
    .collection("chatMessages")
    .findOne({ user_id: userId }, { sort: { date: -1 } });

  res.status(200).json({ message: lastMessage });
});

// 관리자와 특정 유저 간의 모든 채팅 메시지를 가져오는 라우트
router.get("/admin/chat/:adminId/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let adminId = req.params.adminId;
  let userId = req.params.userId;

  adminId = new ObjectId(adminId);
  userId = new ObjectId(userId);

  // 해당 유저와 관리자가 주고받은 모든 메시지를 날짜순으로 정렬하여 가져옴
  const messages = await db
    .getDb()
    .collection("chatMessages")
    .find({ user_id: userId })
    .sort({ date: 1 })
    .toArray();

  res.status(200).json({ messages });
});

// 관리자 메시지를 추가하는 라우트
router.post("/admin/chat/:adminId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  // 클라이언트에서 보낸 데이터 추출
  const { userId, userName, adminEmail, content, userType } = req.body;

  let adminId = req.params.adminId;
  let date = new Date();

  adminId = new ObjectId(adminId);

  // 새 메시지 객체 생성
  const newMessage = {
    user_id: new ObjectId(userId),
    user_name: userName,
    admin_id: adminId,
    email: adminEmail,
    content: content,
    userType: userType,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  // 새 메시지를 chatMessages 컬렉션에 저장
  await db.getDb().collection("chatMessages").insertOne(newMessage);

  // socket.io를 통해 새 메시지를 해당 채팅방에 브로드캐스트
  const io = req.app.get("io"); // Express 앱에서 Socket.io 인스턴스를 가져옴
  const roomId = `room-${userId}`; // 사용자 ID 기반으로 채팅방 ID 생성
  io.to(roomId).emit("newMessage", newMessage); // 해당 채팅방에 메시지 전송

  res.status(200).json({ newMessage });
});

module.exports = router;
