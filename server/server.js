require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET.IO CONFIG
========================= */
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ chatId, from, to, text }) => {
    const toSocketId = onlineUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receiveMessage", { chatId, from, text });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

