const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const signUpEmail = userData.email;
  const signUpConfirmEmail = userData["email-confirm"];
  const signUpName = userData.name;
  const signUpPassword = userData.password;

  const hashPassword = await bcrypt.hash(signUpPassword, 12);

  const user = {
    email: signUpEmail,
    name: signUpName,
    password: hashPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  console.log(user);

  res.status(201).json({ message: "Success" });
});

module.exports = router;
