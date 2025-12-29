import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_BASE_URL);

const ChatPage = () => {
  const { userId } = useParams(); // other user
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef();

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join", user._id);
  }, [user._id]);

  useEffect(() => {
    const fetchChat = async () => {
      const res = await api.get(`/chats/${userId}`);
      setChat(res.data);
    };
    fetchChat();
  }, [userId]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) =>
        prev && prev._id === msg.chatId
          ? { ...prev, messages: [...prev.messages, { ...msg, sender: { _id: msg.from } }] }
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
    const msg = { ...res.data, sender: { _id: user._id } };

    setChat({ ...chat, messages: [...chat.messages, msg] });

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
          <div key={idx} style={{ marginBottom: 5 }}>
            <strong>{m.sender._id === user._id ? "You" : "Them"}: </strong>
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "80%", marginRight: 5 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
