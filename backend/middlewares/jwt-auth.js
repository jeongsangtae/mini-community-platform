const jwt = require("jsonwebtoken");
const db = require("../data/database");
// const dotenv = require("dotenv");

// dotenv.config();

// const accessToken = async (req, res) => {
//   try {
//     const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
//     const token = req.cookies.accessToken;
//     const loginUserTokenData = jwt.verify(token, accessTokenKey);

//     const loginUserDbData = await db
//       .getDb()
//       .collection("users")
//       .findOne({ email: loginUserTokenData.userEmail });

//     // 디스트럭처링을 통해서 password를 제외한 다른 데이터만 가져옴
//     const { password, ...othersData } = loginUserDbData;

//     res.status(200).json(othersData);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

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
    return othersData;

    // res.status(200).json(othersData);
  } catch (error) {
    console.log(error);
    return null;
    // res.status(500).json(error);
  }
};

// access token을 갱신하는 용도로 사용
const refreshToken = async (req, res, next) => {
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
      },
      accessTokenKey,
      { expiresIn: "1h", issuer: "GGPAN" }
    );

    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    res.status(200).json("Access Token 재생성");
  } catch (error) {
    res.status(200).json(error);
  }
};

module.exports = { accessToken, refreshToken };
