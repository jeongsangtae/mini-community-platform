const jwt = require("jsonwebtoken");
const db = require("../data/database");

const accessToken = async (req, res) => {
  try {
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const token = req.cookies.accessToken;
    const loginUserTokenData = jwt.verify(token, accessTokenKey);

    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    // 디스트럭처링을 통해서 password를 제외한 다른 데이터만 가져옴
    const { password, ...othersData } = loginUserDbData;
    const responseData = {
      ...othersData,
      tokenExp: loginUserTokenData.exp,
      role: loginUserTokenData.role,
    };

    return responseData;
  } catch (error) {
    return null;
  }
};

// access token을 갱신하는 용도로 사용
const refreshToken = async (req, res) => {
  try {
    const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    const token = req.cookies.refreshToken;
    const loginUserTokenData = jwt.verify(token, refreshTokenKey);

    const loginUserDbData = await db
      .getDb()
      .collection("users")
      .findOne({ email: loginUserTokenData.userEmail });

    // access token 새로 발급
    const accessToken = jwt.sign(
      {
        userId: loginUserDbData._id,
        userName: loginUserDbData.name,
        userEmail: loginUserDbData.email,
        role: loginUserTokenData.role,
      },
      accessTokenKey,
      { expiresIn: "1h", issuer: "GGPAN" }
    );

    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    const responseData = { message: "Access Token 재생성" };

    return responseData;
  } catch (error) {
    return null;
  }
};

const refreshTokenExp = async (req, res) => {
  try {
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    const token = req.cookies.refreshToken;
    const loginUserTokenData = jwt.verify(token, refreshTokenKey);

    const responseData = { tokenExp: loginUserTokenData.exp };

    return responseData;
  } catch (error) {
    return null;
  }
};

module.exports = { accessToken, refreshToken, refreshTokenExp };
