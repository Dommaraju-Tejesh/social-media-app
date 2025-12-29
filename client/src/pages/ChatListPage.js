import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const ChatListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      const res = await api.get("/chats");
      setUsers(res.data);
    };
    fetchChatUsers();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Chat Users</h2>
      {Array.isArray(users) && users.map((u) => (
        <div key={u._id} style={{ borderBottom: "1px solid #ddd", padding: 5 }}>
          {u.username}
          <Link to={`/chat/${u._id}`} style={{ marginLeft: 10 }}>
            Open Chat
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatListPage;
