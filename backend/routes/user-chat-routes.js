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

router.post("/chat/:userId", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  let userId = req.params.userId;
  const userEmail = req.body.userEmail;
  const messageInput = req.body.message;
  let date = new Date();

  userId = new ObjectId(userId);

  const newChat = {
    user_id: userId,
    email: userEmail,
    message: messageInput,
    date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
  };

  await db.getDb().collection("userChat").insertOne(newChat);

  res.status(200).json({ newChat });
});

module.exports = router;
