const jwt = require("jsonwebtoken");
const db = require("../data/database");

// Access Token을 검증하고 자용자 데이터를 반환하는 함수
const accessToken = async (req, res) => {
  try {
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Token이 없습니다. 로그인해주세요." });
    }

    const loginUserTokenData = jwt.verify(token, accessTokenKey);
    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    if (!loginUserDbData) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const { password, ...othersData } = loginUserDbData;
    const responseData = {
      ...othersData,
      tokenExp: loginUserTokenData.exp,
      role: loginUserTokenData.role,
    };

    return responseData;
  } catch (error) {
    errorHandler(res, error, "Access Token 검증에 실패");
    return null; // 이 부분은 불필요할 수 있음
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
      { expiresIn: "1h", issuer: "GGPAN" } // 토큰 유효시간 1시간 설정
    );

    // 새로 발급한 accessToken을 쿠키에 저장
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
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
