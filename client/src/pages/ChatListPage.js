import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const ChatListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await api.get("/api/chats"); // ✅ FIXED
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load chat users", err);
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Chat Users</h2>

      {users.length === 0 && <p>No users to chat with</p>}

      {users.map((u) => (
        <div
          key={u._id}
          style={{ borderBottom: "1px solid #ddd", padding: 8 }}
        >
          <strong>{u.username}</strong>

          <Link to={`/chat/${u._id}`} style={{ marginLeft: 10 }}>
            <button className="btn btn-sm btn-primary">Open Chat</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatListPage;

