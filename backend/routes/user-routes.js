const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/signup", (req, res) => {
  let sessionSignUpInputData = req.session.inputData;

  if (!sessionSignUpInputData) {
    sessionSignUpInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      name: "",
      password: "",
    };
  }

  req.session.inputData = null;

  res.json({ inputData: sessionSignUpInputData });
});

// 가입한 이메일, 패스워드를 mongodb에 저장
// 패스워드는 bcrypt를 통해서 hash되며, 안전하게 저장
router.post("/signup", async (req, res) => {
  const userData = req.body;
  const signUpEmail = userData.email;
  const signUpConfirmEmail = userData.confirmEmail;
  const signUpUsername = userData.username;
  const signUpPassword = userData.password;

  // 이메일, 이메일확인, 이름, 패스워드 등 잘못된 입력을 확인하는 코드
  if (
    !signUpEmail ||
    !signUpConfirmEmail ||
    !signUpUsername ||
    !signUpPassword ||
    signUpEmail !== signUpConfirmEmail ||
    !signUpEmail.includes("@")
  ) {
    req.session.inputData = {
      hasError: true,
      message: "잘못된 입력입니다. 다시 입력해주세요.",
      email: signUpEmail,
      confirmEmail: signUpConfirmEmail,
      name: signUpUsername,
      password: signUpPassword,
    };

    req.session.save(() => {
      res.status(400).json(req.session.inputData);
    });

    return;
  } else if (signUpUsername.trim().length > 6) {
    req.session.inputData = {
      hasError: true,
      message: "이름은 6자리까지 입력할 수 있습니다.",
      email: signUpEmail,
      confirmEmail: signUpConfirmEmail,
      name: signUpUsername,
      password: signUpPassword,
    };

    req.session.save(() => {
      res.status(400).json(req.session.inputData);
    });

    return;
  }

  const hashPassword = await bcrypt.hash(signUpPassword, 12);

  const user = {
    email: signUpEmail,
    name: signUpUsername,
    password: hashPassword,
  };

  const result = await db.getDb().collection("users").insertOne(user);

  console.log(result);

  res.status(201).json({ message: "Success" });
  // res.status(500).send("Internal Server Error");
});

module.exports = router;
