// require('dotenv').config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

const corsOption = {
  credentials: true,
  origin: [process.env.FRONT_URL],
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello from express Js");
});

// Sockets
let newsData = [];
io.on("connection", (socket) => {
  console.log("New connection", socket.id);
  socket.on("join-room", (data) => {
    newsData.push({
      id: data.id,
      socketId: data.socketId,
    });
    if (newsData.length !== 0) {
      newsData.forEach((item) => {
        io.to(item.socketId).emit("user-join-room", {
          userData: newsData.filter((item2) => item2.id === item.id),
        });
      });
    }

    console.log(newsData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
