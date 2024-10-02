const jwt = require("jsonwebtoken");
const db = require("../data/database");

// Access Token을 검증하고 자용자 데이터를 반환하는 함수
const accessToken = async (req, res) => {
  try {
    // 환경 변수에서 accessToken 키를 가져옴
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const token = req.cookies.accessToken; // 쿠키에서 accessToken을 가져옴
    // accessToken을 검증하고 해독된 데이터를 얻음
    const loginUserTokenData = jwt.verify(token, accessTokenKey);

    // DB에서 토큰에 포함된 이메일로 사용자를 조회
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    // 디스트럭처링을 통해서 password를 제외한 나머지 사용자 데이터만 가져옴
    const { password, ...othersData } = loginUserDbData;

    // 응답 데이터에 토큰 만료 시간과 역할(role)을 추가하여 반환
    const responseData = {
      ...othersData,
      tokenExp: loginUserTokenData.exp,
      role: loginUserTokenData.role,
    };

    return responseData; // 사용자 데이터 반환
  } catch (error) {
    return null; // 오류 발생 시 null 반환
  }
};

// Access Token을 새로 발급하는 함수 (refresh token 사용)
const refreshToken = async (req, res) => {
  try {
    // 환경 변수에서 accessToken 키를 가져옴
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    // 환경 변수에서 refreshToken 키를 가져옴
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    const token = req.cookies.refreshToken; // 쿠키에서 refreshToken을 가져옴
    // refreshToken을 검증하고 해독된 데이터를 얻음
    const loginUserTokenData = jwt.verify(token, refreshTokenKey);

    // DB에서 토큰에 포함된 이메일로 사용자를 조회
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    // 새로운 accessToken 발급
    const accessToken = jwt.sign(
      {
        userId: loginUserDbData._id,
        userName: loginUserDbData.name,
        userEmail: loginUserDbData.email,
        role: loginUserTokenData.role,
      },
      accessTokenKey,
      // { expiresIn: "1h", issuer: "GGPAN" } // 토큰 유효시간 1시간 설정
      { expiresIn: "30m", issuer: "GGPAN" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // 새로 발급한 accessToken을 쿠키에 저장
    res.cookie("accessToken", accessToken, {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
    });

    return { message: "Access Token 재생성" }; // 성공 메시지를 반환
  } catch (error) {
    return null; // 오류 발생 시 null 반환
  }
};

// Refresh Token의 만료 시간을 반환하는 함수
const refreshTokenExp = async (req, res) => {
  try {
    // 환경 변수에서 refreshToken 키를 가져옴
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    const token = req.cookies.refreshToken; // 쿠키에서 refreshToken을 가져옴
    // refreshToken을 검증하고 해독된 데이터를 얻음
    const loginUserTokenData = jwt.verify(token, refreshTokenKey);

    // 토큰 만료 시간을 응답 데이터로 반환
    return { tokenExp: loginUserTokenData.exp }; // 만료 시간 데이터를 반환
  } catch (error) {
    return null; // 오류 발생 시 null 반환
  }
};

module.exports = { accessToken, refreshToken, refreshTokenExp };
