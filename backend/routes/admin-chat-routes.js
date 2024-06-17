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

router.post("/admin/chat/:adminId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ messages: "jwt error" });
  }

  let adminId = req.params.adminId;
  const adminEmail = req.body.adminEmail;
  const messageInput = req.body.message;
  let date = new Date();

  adminId = new ObjectId(adminId);

  const newMessage = {
    admin_id: adminId,
    email: adminEmail,
    content: messageInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db.getDb().collection("adminChat").insertOne(newMessage);

  const io = req.app.get("io");
  io.emit("newMessage", newMessage);

  console.log("관리자 input 메시지: ", newMessage.content);

  res.status(200).json({ newMessage });
});

module.exports = router;
