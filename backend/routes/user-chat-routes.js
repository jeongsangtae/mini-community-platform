const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const { accessToken } = require("../middlewares/jwt-auth");
const { errorHandler } = require("../utils/error-handler");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

// 사용자의 채팅 메시지를 가져오는 라우터
router.get("/chat/:userId", async (req, res) => {
  try {
    // JWT 토큰을 통해 사용자 인증
    const othersData = await accessToken(req, res);

    if (!othersData) {
      return res.status(401).json({ message: "jwt error" });
    }

    let userId = req.params.userId;

    userId = new ObjectId(userId);

    // MongoDB에서 특정 userId에 해당하는 채팅 메시지들을 가져옴
    const messages = await db
      .getDb()
      .collection("chatMessages")
      .find({ user_id: userId })
      .sort({ date: 1 }) // 날짜 기준으로 정렬 (오름차순)
      .toArray();

    res.status(200).json({ messages });
  } catch (error) {
    errorHandler(res, error, "채팅 메시지 조회 중 오류 발생");
  }
});

// 사용자가 입력한 채팅 메시지를 저장하는 라우터
router.post("/chat/:userId", async (req, res) => {
  try {
    const othersData = await accessToken(req, res);

    if (!othersData) {
      return res.status(401).json({ message: "jwt error" });
    }

    // 클라이언트에서 보낸 데이터 추출
    const { userEmail, content, userType } = req.body;

    const userId = req.params.userId;

    let date = new Date();
    let kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    // 새 메시지 객체 생성
    const newMessage = {
      user_id: new ObjectId(userId), // MongoDB ObjectId로 변환된 userId
      email: userEmail,
      content: content,
      userType: userType,
      date: `${kstDate.getFullYear()}.${(kstDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${kstDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${kstDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${kstDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${kstDate.getSeconds().toString().padStart(2, "0")}`, // 날짜 및 시간을 포맷팅하여 문자열로 저장
    };

    // 새 메시지를 chatMessages 컬렉션에 저장
    await db.getDb().collection("chatMessages").insertOne(newMessage);

    // socket.io를 통해 새 메시지를 해당 채팅방에 브로드캐스트
    const io = req.app.get("io"); // Express 앱에서 Socket.io 인스턴스를 가져옴
    const roomId = `room-${userId}`; // 사용자 ID 기반으로 채팅방 ID 생성
    io.to(roomId).emit("newMessage", newMessage); // 해당 채팅방에 메시지 전송

    res.status(200).json({ newMessage });
  } catch (error) {
    errorHandler(res, error, "채팅 메시지 저장 중 오류 발생");
  }
});

module.exports = router;
