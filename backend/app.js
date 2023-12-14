const path = require("path");

const express = require("express");

const boardRoutes = require("./routes/board-routes");
const db = require("./data/database");

const app = express();

app.use(express.static("public"));

// CORS 헤더 연결
// 분리된 백엔드(다른 도메인에서 실행됨)를 사용할 때 필요
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// 캐시 제어 헤더
// app.use(function (req, res, next) {
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });

app.use(boardRoutes);

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
