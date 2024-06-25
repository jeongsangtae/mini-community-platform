const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../data/database");

const {
  accessToken,
  refreshToken,
  refreshTokenExp,
} = require("../middlewares/jwt-auth");

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
    .collection("userChat")
    .find({ user_id: userId })
    .toArray();

  res.status(200).json({ messages });
});

router.post("/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  const userId = req.params.userId;
  const userEmail = req.body.userEmail;
  const messageInput = req.body.content;
  let date = new Date();

  // userId = new ObjectId(userId);

  const newMessage = {
    user_id: new ObjectId(userId),
    email: userEmail,
    content: messageInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db.getDb().collection("userChat").insertOne(newMessage);

  // socket.io를 통해 메시지를 브로드캐스트
  const io = req.app.get("io");
  const roomId = `room-${userId}`;
  io.to(roomId).emit("newMessage", newMessage);
  // io.emit("newMessage", newMessage);

  console.log("사용자 input 메시지: ", newMessage.content);

  res.status(200).json({ newMessage });
});

module.exports = router;
