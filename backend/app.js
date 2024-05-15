const path = require("path");

const express = require("express");
const http = require("http"); // socket.io를 위한 기본 구성
const socketIo = require("socket.io"); // socket.io를 위한 기본 구성2
const dotenv = require("dotenv");

const db = require("./data/database");
const boardRoutes = require("./routes/board-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
const server = http.createServer(app); // socket.io
const io = socketIo(server);
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
  })
  .catch((error) => {
    console.log("데이터베이스에 연결하지 못했습니다.");
    console.log(error);
  });

console.log("run server");

// Socket.IO 설정
io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  // 클라이언트에서 보낸 이벤트 수신 및 처리
  socket.on("message", (msg) => {
    console.log("메시지를 받았습니다:", msg);
    // 클라이언트에게 메시지 전송
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트가 연결을 끊었습니다.");
  });
});
