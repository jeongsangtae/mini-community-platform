const path = require("path");

const express = require("express");
const dotenv = require("dotenv");

const http = require("http"); // http 모듈 추가
const { Server } = require("socket.io"); // socket.io 추가

const db = require("./data/database");
const boardRoutes = require("./routes/board-routes");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");
const userChatRoutes = require("./routes/user-chat-routes");
const adminChatRoutes = require("./routes/admin-chat-routes");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// 캐시 제어 헤더
// app.use(function (req, res, next) {
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });

// CORS 헤더 연결
// 분리된 백엔드(다른 도메인에서 실행됨)를 사용할 때 필요
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// CORS 미들웨어를 사용해서 연결
// CORS 설정: 클라이언트 애플리케이션에서 서버로 요청을 보낼 때, 다른 도메인 간의 요청을 허용함
let corsURL = process.env.CORS_URL || "http://localhost:5173";

app.use(
  cors({
    origin: corsURL, // 클라이언트 도메인
    credentials: true,
  })
);

app.use(boardRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(userChatRoutes);
app.use(adminChatRoutes);

// 프론트엔드 파일 설정을 추가
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

// 서버 설정
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io 객체를 Express 앱 객체에 저장하여 라우트 함수에서도 접근할 수 있도록 함
app.set("io", io);

// 클라이언트가 Socket.io 연결을 맺을 때 실행되는 이벤트 함수
// Socket.io 설정
io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다:", socket.id);

  // 클라이언트를 특정 방에 참여시킴
  socket.on("joinRoom", ({ userId, userType }) => {
    const roomId = `room-${userId}`;
    socket.join(roomId);
    console.log(
      `사용자 _id: ${userId}, 사용자 type: ${userType}, 방 번호: ${roomId}`
    );
  });

  // 클라이언트가 연결을 끊었을 때 실행되는 이벤트 함수
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다:", socket.id);
  });
});

// MongoDB에 연결한 후 서버를 시작
// MongoDB 설정
db.connectToDatabase()
  .then(() => {
    // app.listen 대신 server.listen 사용
    server.listen(port, "0.0.0.0", () => {
      console.log(`서버가 실행되었습니다. 포트: ${port}`);
    });
  })
  .catch((error) => {
    console.log("데이터베이스에 연결하지 못했습니다.");
    console.log(error);
  });

// MongoDB 설정으로, socket.io 사용하기 전의 설정
// db.connectToDatabase()
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch((error) => {
//     console.log("데이터베이스에 연결하지 못했습니다.");
//     console.log(error);
//   });

// console.log("run server");
