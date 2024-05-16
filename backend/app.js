const path = require("path");

const express = require("express");
const dotenv = require("dotenv");

const db = require("./data/database");
const boardRoutes = require("./routes/board-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

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

app.use(express.json());
app.use(cookieParser());

// CORS 헤더 연결
// 분리된 백엔드(다른 도메인에서 실행됨)를 사용할 때 필요
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// CORS 미들웨어를 사용해서 연결
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(boardRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

// MongoDB 설정
db.connectToDatabase()
  .then(() => {
    app.listen(3000);
    // console.log("데이터베이스에 연결되었습니다.");
  })
  .catch((error) => {
    console.log("데이터베이스에 연결하지 못했습니다.");
    console.log(error);
  });

console.log("run server");

// const { Server } = require("socket.io");

// const io = new Server({ cors: "http://localhost:5173" });

// io.on("connection", (socket) => {
//   console.log("socket 연결", socket.id);
//   console.log("");
// });

// io.listen(3001);
