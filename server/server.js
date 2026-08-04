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

const adminRoutes = require("./routes/adminRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET.IO CONFIG
========================= */

const io = new Server(server, {
  cors: {
    origin: "https://pullimedia.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

// userId -> { socketId, lastSeen }
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // =========================
  // USER JOIN
  // =========================
  socket.on("join", (userId) => {
    onlineUsers.set(userId, {
      socketId: socket.id,
      lastSeen: null,
    });

    console.log(`${userId} is online`);

    socket.broadcast.emit("userOnline", userId);
  });

  // =========================
  // SEND MESSAGE
  // =========================
  socket.on("sendMessage", (message) => {
    const receiver = onlineUsers.get(message.to);

    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", message);

      io.to(receiver.socketId).emit("refreshChatList");
    }

    socket.emit("refreshChatList");
  });

  // =========================
  // MESSAGE SEEN
  // =========================
  socket.on("messageSeen", ({ to, from, messageId }) => {
    const receiver = onlineUsers.get(to);

    if (receiver) {
      io.to(receiver.socketId).emit("messageSeen", {
        from,
        messageId,
      });
    }
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    for (const [userId, data] of onlineUsers.entries()) {
      if (data.socketId === socket.id) {
        data.lastSeen = new Date();

        onlineUsers.delete(userId);

        console.log(`${userId} went offline`);

        socket.broadcast.emit("userOffline", {
          userId,
          lastSeen: data.lastSeen,
        });

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
    origin: "https://pullimedia.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.options("*", cors());

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
app.use("/api/admin", adminRoutes);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
