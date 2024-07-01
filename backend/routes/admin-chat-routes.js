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

router.get("/admin/chat/:adminId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let adminId = req.params.adminId;

  adminId = new ObjectId(adminId);

  const messages = await db
    .getDb()
    .collection("chatMessages")
    .find({ admin_id: adminId })
    .toArray();

  res.status(200).json({ messages });
});

router.post("/admin/chat/:adminId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  const { adminEmail, content, userType } = req.body;

  let adminId = req.params.adminId;
  const testUserId = req.body.userId;
  // const adminEmail = req.body.adminEmail;
  // const messageInput = req.body.content;
  let date = new Date();

  adminId = new ObjectId(adminId);

  const newMessage = {
    user_id: new ObjectId(testUserId),
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

  // await db.getDb().collection("adminChat").insertOne(newMessage);
  await db.getDb().collection("chatMessages").insertOne(newMessage);

  const io = req.app.get("io");
  const roomId = `room-${testUserId}`;
  io.to(roomId).emit("newMessage", newMessage);
  // io.emit("newMessage", newMessage);

  console.log("관리자 input 메시지: ", newMessage.content);

  res.status(200).json({ newMessage });
});

module.exports = router;
