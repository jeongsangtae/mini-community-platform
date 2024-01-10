const path = require("path");

const express = require("express");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const boardRoutes = require("./routes/board-routes");
const userRoutes = require("./routes/user-routes");
const db = require("./data/database");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// app.use(express.static(path.join(__dirname, "/frontend/public")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
// });

// 캐시 제어 헤더
// app.use(function (req, res, next) {
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });

// 클라이언트로부터 오는 HTTP 요청의 body를 해석
// req.body에 form 데이터가 제대로 파싱되어 들어오도록 해줌
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 헤더 연결
// 분리된 백엔드(다른 도메인에서 실행됨)를 사용할 때 필요
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// CORS 미들웨어를 사용해서 연결
app.use(cors());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(boardRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("데이터베이스에 연결하지 못했습니다.");
    console.log(error);
  });

console.log("run server");
