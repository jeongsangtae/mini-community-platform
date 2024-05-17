// const http = require("http"); // socket.io를 위한 기본 구성
// const socketIo = require("socket.io"); // socket.io를 위한 기본 구성2

// const server = http.createServer(app); // socket.io
// const io = socketIo(server);

// io.on("connection", (socket) => {
//   console.log("클라이언트가 연결되었습니다.");

//   // 클라이언트에서 보낸 이벤트 수신 및 처리
//   socket.on("message", (msg) => {
//     console.log("메시지를 받았습니다:", msg);
//     // 클라이언트에게 메시지 전송
//     io.emit("message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("클라이언트가 연결을 끊었습니다.");
//   });
// });

const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

io.on("connection", (socket) => {
  console.log("socket 연결", socket.id);

  socket.on("clientMessage", (msg) => {
    console.log("클라이언트로부터의 메시지:", msg);
  });

  socket.emit("message", "소켓 연결이 성공적으로 이루어졌습니다.");
});

io.listen(3001);
