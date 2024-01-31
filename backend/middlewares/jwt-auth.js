const jwt = require("jsonwebtoken");
const db = require("../data/database");
// const dotenv = require("dotenv");

// dotenv.config();

const accessToken = async (req, res) => {
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
  const token = req.cookies.accessToken;
  const userData = jwt.verify(token, accessTokenKey);

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  console.log(userData.userEmail);

  const existingLoginUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: userData.userEmail });

  res.status(200).json(existingLoginUser);
};

const refreshToken = (req, res, next) => {};

module.exports = { accessToken };
