import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("https://social-media-server-qki3.onrender.com");

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useAuth();

  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${userId}`);
        setChat(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load chat");
      }
    };
    fetchChat();
  }, [userId]);

  const sendMessage = async () => {
    if (!text.trim() || !chat) return;

    try {
      const res = await api.post(
        `/chats/${chat._id}/messages`,
        { text }
      );

      socket.emit("sendMessage", {
        chatId: chat._id,
        from: user._id,
        to: userId,
        text,
      });

      setChat({
        ...chat,
        messages: [...chat.messages, res.data],
      });
      setText("");
    } catch (err) {
      console.error(err);
      alert("Message failed");
    }
  };

  if (error) return <div>{error}</div>;
  if (!chat) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h3>Chat</h3>

      <div style={{ minHeight: 300, border: "1px solid #ddd", padding: 10 }}>
        {chat.messages.map((m, i) => (
          <div key={i}>
            <strong>{m.sender?.username || "User"}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          style={{ flex: 1 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
