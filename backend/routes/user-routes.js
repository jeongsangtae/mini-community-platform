const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../data/database");
const {
  accessToken,
  refreshToken,
  refreshTokenExp,
} = require("../middlewares/jwt-auth");
const { errorHandler } = require("../utils/error-handler");

const router = express.Router();

// 회원가입 라우터
// 사용자가 입력한 이메일, 패스워드를 받아 mongodb에 저장
// 패스워드는 bcrypt를 통해서 hash되며, 안전하게 저장
router.post("/signup", async (req, res) => {
  try {
    const userData = req.body;
    const signUpEmail = userData.email;
    const signUpConfirmEmail = userData.confirmEmail;
    const signUpUsername = userData.username;
    const signUpPassword = userData.password;

    // 이메일, 이메일 확인, 이름, 패스워드 등 잘못된 입력을 확인하는 코드
    // 조건이 맞지 않으면 오류 메시지와 함께 요청을 거절
    if (
      !signUpEmail ||
      !signUpConfirmEmail ||
      !signUpUsername ||
      !signUpPassword ||
      signUpEmail !== signUpConfirmEmail ||
      !signUpEmail.includes("@") ||
      signUpUsername.trim().length > 5 ||
      signUpPassword.trim().length < 6
    ) {
      let message = "잘못된 입력입니다. 다시 입력해주세요.";

      if (signUpUsername.trim().length > 5) {
        message = "이름은 5자리까지 입력할 수 있습니다.";
      } else if (signUpPassword.trim().length < 6) {
        message = "비밀번호를 6자리 이상 입력해주세요.";
      }

      res.status(400).json({ message });
      return;
    }

    // DB에서 이미 사용 중인 이메일인지 확인
    const existingSignUpUser = await db
      .getDb()
      .collection("users")
      .findOne({ email: signUpEmail });

    // 이메일이 이미 존재하면 오류 메시지 전송
    if (existingSignUpUser) {
      return res.status(400).json({
        message: "해당 이메일은 이미 사용중입니다.",
      });
    }

    // 비밀번호를 해시하여 DB에 저장
    const hashPassword = await bcrypt.hash(signUpPassword, 12);

    const user = {
      email: signUpEmail,
      name: signUpUsername,
      password: hashPassword,
    };

    // 새 사용자 데이터를 MongoDB에 저장
    const result = await db.getDb().collection("users").insertOne(user);

    console.log(result);

    res.status(200).json({ message: "회원가입 성공" });
  } catch (error) {
    errorHandler(res, error, "회원가입 중 오류 발생");
  }
});

// 로그인 라우터
// 사용자가 입력한 이메일과 패스워드를 통해 로그인 처리
router.post("/login", async (req, res) => {
  try {
    const userData = req.body;
    const loginEmail = userData.email;
    const loginPassword = userData.password;

    // 입력한 이메일이 DB에 존재하는지 확인
    const existingLoginUser = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginEmail });

    // 이메일이 존재하지 않거나 비밀번호가 일치하지 않는 경우 오류 메시지 전송
    if (!existingLoginUser) {
      return res.status(400).json({ message: "존재하지 않는 이메일입니다." });
    }

    // 해시된 비밀번호와 사용자가 입력한 비밀번호 비교
    const passwordEqual = await bcrypt.compare(
      loginPassword,
      existingLoginUser.password
    );

    if (!passwordEqual) {
      return res.status(400).json({ message: "패스워드가 일치하지 않습니다." });
    }

    // 이메일과 비밀번호가 모두 올바르면 JWT 토큰을 생성하여 쿠키에 저장
    const userRole = loginEmail === "admin@admin.com" ? "admin" : "user";

    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

    // Access Token 발급
    const accessToken = jwt.sign(
      {
        userId: existingLoginUser._id,
        userName: existingLoginUser.name,
        userEmail: existingLoginUser.email,
        role: userRole,
      },
      accessTokenKey,
      // { expiresIn: "1h", issuer: "GGPAN" }
      { expiresIn: "1m", issuer: "GGPAN" }
    );

    // Refresh Token 발급
    const refreshToken = jwt.sign(
      {
        userId: existingLoginUser._id,
        userName: existingLoginUser.name,
        userEmail: existingLoginUser.email,
        role: userRole,
      },
      refreshTokenKey,
      // { expiresIn: "6h", issuer: "GGPAN" }
      { expiresIn: "5m", issuer: "GGPAN" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    console.log("현재 환경:", process.env.NODE_ENV);

    console.log(isProduction);

    // 쿠키에 토큰 저장 (httpOnly 옵션으로 클라이언트에서 직접 접근 불가)
    res.cookie("accessToken", accessToken, {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      // maxAge: 60 * 60 * 1000, // 1시간
      maxAge: 1 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      // maxAge: 6 * 60 * 60 * 1000, // 6시간
      maxAge: 5 * 60 * 1000,
    });

    // 성공 메시지와 함께 토큰 정보 반환
    res.status(200).json({
      message: "로그인 성공",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // console.error("로그인 중 발생한 에러:", error); // 에러 객체 출력
    // console.error("에러 메시지:", error.message); // 에러 메시지 출력
    // console.error("스택 트레이스:", error.stack); // 스택 트레이스 출력
    errorHandler(res, error, "로그인 중 오류 발생");
  }
});

// Access Token 확인
router.get("/accessToken", async (req, res) => {
  try {
    const responseData = await accessToken(req, res);

    if (!responseData) {
      return res.status(401).json({ message: "jwt error" });
    }

    res.status(200).json(responseData);
  } catch (error) {
    errorHandler(res, error, "Access Token 확인 중 오류 발생");
  }
});

// Refresh Token 확인
router.get("/refreshToken", async (req, res) => {
  try {
    const responseData = await refreshToken(req, res);

    if (!responseData) {
      return res.status(401).json({ message: "jwt error" });
    }

    res.status(200).json(responseData);
  } catch (error) {
    errorHandler(res, error, "Refresh Token 확인 중 오류 발생");
  }
});

// Refresh Token 만료 여부 확인
router.get("/refreshTokenExp", async (req, res) => {
  try {
    const responseData = await refreshTokenExp(req, res);

    if (!responseData) {
      return res.status(401).json({ message: "jwt error" });
    }

    res.status(200).json(responseData);
  } catch (error) {
    errorHandler(res, error, "Refresh Token 만료 시간 확인 중 오류 발생");
  }
});

// 로그인 성공 시 사용자 정보 반환
router.get("/login/success", async (req, res) => {
  try {
    const responseData = await accessToken(req, res);

    if (!responseData) {
      return res.status(401).json({ message: "jwt error" });
    }

    res.status(200).json(responseData);
  } catch (error) {
    errorHandler(res, error, "로그인 중 오류 발생");
  }
});

// 로그아웃 처리, 쿠키에서 토큰 제거
router.post("/logout", async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    res.clearCookie("accessToken", {
      secure: isProduction, // 쿠키 설정 시 사용한 옵션과 동일하게
      sameSite: isProduction ? "None" : "Lax", // sameSite도 동일하게
    });
    res.clearCookie("refreshToken", {
      secure: isProduction, // 쿠키 설정 시 사용한 옵션과 동일하게
      sameSite: isProduction ? "None" : "Lax", // sameSite도 동일하게
    });
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (error) {
    errorHandler(res, error, "로그아웃 중 오류 발생");
  }
});

// 사용자 프로필 정보와 게시글 조회
// 검색 기능 및 페이지네이션 포함
router.get("/profile", async (req, res) => {
  try {
    const responseData = await accessToken(req, res);

    if (!responseData) {
      return res.status(401).json({ message: "jwt error" });
    }

    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const fields = (req.query.field || "").split(",");
    const pageSize = 5;
    const pageButtonSize = 5;

    // 사용자 이메일을 기반으로 필터 생성
    let filter = { email: responseData.email };

    // 검색어가 있을 경우 검색어 필터 추가
    if (search && fields.length) {
      filter.$or = fields.map((field) => ({
        [field]: { $regex: search, $options: "i" }, // 선택된 필드에서 검색어 찾기 (대소문자 구분 없음)
      }));
    } else if (search) {
      // 필드를 지정하지 않은 경우 모든 필드에서 검색
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // 사용자의 게시글을 필터, 페이지네이션 및 정렬 기준에 따라 조회
    const posts = await db
      .getDb()
      .collection("posts")
      .find(filter)
      .sort({ postId: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .project({ postId: 1, title: 1, name: 1, content: 1, date: 1, count: 1 })
      .toArray();

    // 총 게시글 수
    const countPosts = await db
      .getDb()
      .collection("posts")
      .countDocuments(filter);

    // 전체 게시글 수를 계산하여 페이지 수를 계산
    const totalPages = Math.ceil(countPosts / pageSize);

    // 페이지네이션의 시작과 끝 페이지 번호 계산
    // 페이지 그룹 계산
    const firstPageGroup =
      Math.ceil(page / pageButtonSize) * pageButtonSize - pageButtonSize + 1;
    const lastPageGroup = Math.min(
      firstPageGroup + pageButtonSize - 1,
      totalPages
    );

    // 게시글 데이터와 페이지네이션 정보 반환
    res.status(200).json({
      posts,
      countPosts,
      page,
      totalPages,
      firstPageGroup,
      lastPageGroup,
      responseData,
    });
  } catch (error) {
    errorHandler(res, error, "프로필 정보 또는 게시글 조회 중 오류 발생");
  }
});

module.exports = router;
