const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const jwtAuth = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(req.header);
  console.log(token);
  const tokenKey = process.env.TOKEN_KEY;

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  jwt.verify(token, tokenKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "토큰 검증 실패" });
    }

    req.user = user;
    next();
  });
};

module.exports = jwtAuth;
