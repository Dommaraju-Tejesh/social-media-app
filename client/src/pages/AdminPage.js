import React, { useEffect, useState } from "react";
import api from "../api";

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalChats: 0,
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleBan = async (id) => {
    try {
      await api.put(`/admin/users/${id}/ban`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to ban user");
    }
  };

  const handleUnban = async (id) => {
    try {
      await api.put(`/admin/users/${id}/unban`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to unban user");
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      setStats(res.data.stats);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: 30 }}>📊 Pulli Media Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 15,
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 15,
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>{stats.totalPosts}</h2>
          <p>Total Posts</p>
        </div>

        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 15,
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>{stats.totalChats}</h2>
          <p>Total Chats</p>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 15,
          padding: 20,
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
        }}
      >
        <h3>Users</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <img
                    src={
                      u.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>

                <td>{u.username}</td>

                <td>{u.email}</td>

                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {u.isBanned ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      🔴 Banned
                    </span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      🟢 Active
                    </span>
                  )}
                </td>

                <td>
                  {u.isAdmin ? (
                    <span style={{ color: "#888" }}>Admin</span>
                  ) : u.isBanned ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUnban(u._id)}
                    >
                      ✅ Unban
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleBan(u._id)}
                    >
                      🚫 Ban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
