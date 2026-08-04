import { io } from "socket.io-client";

const socket = io(
  process.env.REACT_APP_API_BASE_URL?.replace("/api", "") ||
    "https://social-media-server-qki3.onrender.com",
  {
    transports: ["websocket"],
    withCredentials: true,
  }
);

export default socket;