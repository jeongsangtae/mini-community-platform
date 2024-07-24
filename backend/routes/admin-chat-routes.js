const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");

const { accessToken } = require("../middlewares/jwt-auth");

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/admin/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let userId = req.params.userId;

  userId = new ObjectId(userId);

  const lastMessage = await db
    .getDb()
    .collection("chatMessages")
    .findOne({ user_id: userId }, { sort: { date: -1 } });

  res.status(200).json({ message: lastMessage });
});

router.get("/admin/chat/:adminId/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let adminId = req.params.adminId;
  let userId = req.params.userId;

  adminId = new ObjectId(adminId);
  userId = new ObjectId(userId);

  const messages = await db
    .getDb()
    .collection("chatMessages")
    .find({ user_id: userId })
    .sort({ date: 1 })
    .toArray();

  res.status(200).json({ messages });
});

router.post("/admin/chat/:adminId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  const { userId, userName, adminEmail, content, userType } = req.body;

  let adminId = req.params.adminId;
  let date = new Date();

  adminId = new ObjectId(adminId);

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

  await db.getDb().collection("chatMessages").insertOne(newMessage);

  const io = req.app.get("io");
  const roomId = `room-${userId}`;
  io.to(roomId).emit("newMessage", newMessage);

  res.status(200).json({ newMessage });
});

module.exports = router;
