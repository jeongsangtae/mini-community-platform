const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let userId = req.params.userId;

  userId = new ObjectId(userId);

  const messages = await db
    .getDb()
    .collection("chatMessages")
    .find({ user_id: userId })
    .sort({ date: 1 })
    .toArray();

  res.status(200).json({ messages });
});

router.post("/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  const { userEmail, content, userType } = req.body;

  const userId = req.params.userId;

  let date = new Date();

  const newMessage = {
    user_id: new ObjectId(userId),
    email: userEmail,
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

  await db.getDb().collection("chatMessages").insertOne(newMessage);

  // socket.io를 통해 메시지를 브로드캐스트
  const io = req.app.get("io");
  const roomId = `room-${userId}`;
  io.to(roomId).emit("newMessage", newMessage);

  res.status(200).json({ newMessage });
});

module.exports = router;
