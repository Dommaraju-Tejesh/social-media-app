import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("https://social-media-server-qki3.onrender.com");

const ChatPage = () => {
  const { userId } = useParams(); // other user
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // join socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  // fetch or create chat (LOAD OLD MESSAGES)
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${userId}`); // ✅ CORRECT
        setChat(res.data);
      } catch (err) {
        console.error("Failed to load chat", err);
      }
    };
    fetchChat();
  }, [userId]);

  // receive realtime messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) =>
        prev && prev._id === msg.chatId
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                { text: msg.text, sender: { _id: msg.from } },
              ],
            }
          : prev
      );
      scrollBottom();
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(scrollBottom, [chat]);

  const sendMessage = async () => {
    if (!text.trim() || !chat) return;

    const res = await api.post(`/chats/${chat._id}/messages`, { text });

    setChat({
      ...chat,
      messages: [
        ...chat.messages,
        { ...res.data, sender: { _id: user._id } },
      ],
    });

    socket.emit("sendMessage", {
      chatId: chat._id,
      from: user._id,
      to: userId,
      text,
    });

    setText("");
  };

  if (!chat) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Chat</h2>

      <div
        style={{
          border: "1px solid #ddd",
          minHeight: 300,
          maxHeight: 400,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {chat.messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 6 }}>
            <strong>{m.sender._id === user._id ? "You" : "Them"}:</strong>{" "}
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", marginRight: 6 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
