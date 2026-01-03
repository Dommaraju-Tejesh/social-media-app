import React, { useEffect, useState, useRef } from "react";
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
  const messagesEndRef = useRef();

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchChat = async () => {
      const res = await api.get(`/chats/${userId}`); // ✅ FIXED
      setChat(res.data);
    };
    fetchChat();
  }, [userId]);

  const sendMessage = async () => {
    if (!text.trim() || !chat) return;

    const res = await api.post(
      `/chats/${chat._id}/messages`, // ✅ FIXED
      { text }
    );

    socket.emit("sendMessage", {
      chatId: chat._id,
      from: user._id,
      to: userId,
      text,
    });

    setChat({ ...chat, messages: [...chat.messages, res.data] });
    setText("");
  };

  if (!chat) return <div>Loading...</div>;

  return (
    <div>
      {chat.messages.map((m, i) => (
        <div key={i}>{m.text}</div>
      ))}

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
