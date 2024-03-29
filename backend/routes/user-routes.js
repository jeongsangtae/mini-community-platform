const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// dotenv.config();

const db = require("../data/database");
const { accessToken, refreshToken } = require("../middlewares/jwt-auth");

const router = express.Router();

// router.use("/login", jwtAuth);

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

  req.session.inputData = {};

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
  } else if (signUpPassword.trim().length < 6) {
    req.session.inputData = {
      hasError: true,
      message: "비밀번호를 6자리 이상 입력해주세요.",
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

  const existingSignUpUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: signUpEmail });

  // 이메일이 이미 존재하는지 확인해 다른 이메일을 입력하도록 한다.
  if (existingSignUpUser) {
    req.session.inputData = {
      hasError: true,
      message: "해당 이메일은 이미 사용중입니다.",
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

  res.status(200).json({ message: "Success" });
  // res.status(500).send("Internal Server Error");
});

router.get("/login", (req, res) => {
  let sessionLoginInputData = req.session.inputData;

  // 로그인 페이지 내용을 빈 내용으로 초기화
  if (!sessionLoginInputData) {
    sessionLoginInputData = {
      hasError: false,
      email: "",
      name: "",
      password: "",
    };
  }

  req.session.inputData = {};

  res.json({ inputData: sessionLoginInputData });
});

router.post("/login", async (req, res) => {
  const userData = req.body;
  const loginEmail = userData.email;
  const loginPassword = userData.password;

  const existingLoginUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: loginEmail });

  // 이메일이 존재하는지 확인
  if (!existingLoginUser) {
    req.session.inputData = {
      hasError: true,
      message: "로그인할 수 없습니다. 존재하지 않는 이메일입니다.",
      email: loginEmail,
      password: loginPassword,
    };
    req.session.save(() => {
      res.status(400).json(req.session.inputData);
    });
    return;
  }

  const passwordEqual = await bcrypt.compare(
    loginPassword,
    existingLoginUser.password
  );

  // 해싱되기전 비밀번호와 해싱된 후 비밀번호를 비교해 일치하는지 확인
  if (!passwordEqual) {
    req.session.inputData = {
      hasError: true,
      message: "로그인할 수 없습니다. 패스워드가 틀렸습니다.",
      email: loginEmail,
      password: loginPassword,
    };
    req.session.save(() => {
      res.status(400).json(req.session.inputData);
    });
    return;
  }

  // console.log(existingLoginUser);

  if (existingLoginUser) {
    req.session.user = {
      id: existingLoginUser._id,
      name: existingLoginUser.name,
      email: existingLoginUser.email,
    };

    req.session.isAuthenticated = true;

    try {
      // access Token 발급
      const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
      const accessToken = jwt.sign(
        {
          userId: existingLoginUser._id,
          userName: existingLoginUser.name,
          userEmail: existingLoginUser.email,
        },
        accessTokenKey,
        { expiresIn: "1h", issuer: "GGPAN" }
      );

      // refresh Token 발급
      const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
      const refreshToken = jwt.sign(
        {
          userId: existingLoginUser._id,
          userName: existingLoginUser.name,
          userEmail: existingLoginUser.email,
        },
        refreshTokenKey,
        { expiresIn: "12h", issuer: "GGPAN" }
      );

      // token 전송
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 12 * 1000,
      });

      // const decoded = jwt.decode(accessToken);
      // const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

      // const userInfo = {
      //   _id: decoded.userId,
      //   name: decoded.userName,
      //   email: decoded.userEmail,
      // };

      // console.log("00000000000000");
      // console.log(accessToken);
      // console.log(decoded);
      // console.log(decoded.userName);
      // console.log(decoded.userEmail);
      // console.log(userInfo);
      // console.log("00000000000000");

      res.status(200).json({
        message: "Success",
        isAuthenticated: req.session.isAuthenticated,
        accessToken,
        refreshToken,
        // userInfo,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// router.get("/accessToken", accessToken);

router.get("/accessToken", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  res.status(200).json(othersData);
});

router.get("/refreshToken", refreshToken);

router.get("/login/success", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  res.status(200).json(othersData);
});

router.post("/logout", async (req, res) => {
  try {
    // res.cookie("accessToken", "");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json("로그아웃 성공");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/profile", async (req, res) => {
  const othersData = await accessToken(req, res);

  if (!othersData) {
    return res.status(401).json({ message: "jwt error" });
  }

  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;
  const pageButtonSize = 5;

  const posts = await db
    .getDb()
    .collection("posts")
    .find({ email: othersData.email })
    .sort({ postId: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .project({ postId: 1, title: 1, name: 1, content: 1, date: 1 })
    .toArray();

  const countPosts = await db.getDb().collection("posts").countDocuments({});
  const totalPages = Math.ceil(countPosts / pageSize);

  const firstPageGroup =
    Math.ceil(page / pageButtonSize) * pageButtonSize - pageButtonSize + 1;
  const lastPageGroup = Math.min(
    firstPageGroup + pageButtonSize - 1,
    totalPages
  );

  res.status(200).json({
    posts,
    page,
    totalPages,
    firstPageGroup,
    lastPageGroup,
    othersData,
  });
});

// router.post("/logout", (req, res) => {
//   req.session.user = null;
//   req.session.isAuthenticated = false;
//   res
//     .status(200)
//     .json({ message: "Success", isAuthenticated: req.session.isAuthenticated });
// });

module.exports = router;
