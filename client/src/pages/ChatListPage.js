import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import socket from "../socket";

const ChatListPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // online users
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const fetchChatUsers = async () => {
    try {
      const res = await api.get("/chats");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  // refresh chat list when a new message arrives
  useEffect(() => {
    socket.on("refreshChatList", fetchChatUsers);

    return () => {
      socket.off("refreshChatList", fetchChatUsers);
    };
  }, []);

  // online / offline
  useEffect(() => {
    socket.on("userOnline", (id) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.add(id);
        return updated;
      });
    });

    socket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  // latest chats on top
  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;

        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });
  }, [users, search]);

  const getAvatar = (username = "") => username.charAt(0).toUpperCase();

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{`

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Inter,sans-serif;
}

body{
    background:#f5f7fb;
}

.chat-page{
    min-height:100vh;
    background:
        radial-gradient(circle at top left,#ffffff,#eef4ff 40%,#f7f9fc);
    display:flex;
    justify-content:center;
    align-items:flex-start;
    padding:30px 15px;
}

.glass{
    width:100%;
    max-width:760px;
    background:rgba(255,255,255,.75);
    backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.7);
    border-radius:28px;
    overflow:hidden;
    box-shadow:
        0 10px 40px rgba(15,23,42,.08);
}

.top-bar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:22px 25px;
    border-bottom:1px solid #edf2f7;
}

.title{
    font-size:28px;
    font-weight:700;
    color:#1e293b;
}

.subtitle{
    color:#64748b;
    font-size:14px;
    margin-top:4px;
}

.home-btn{
    text-decoration:none;
    color:#2563eb;
    background:#fff;
    border:1px solid #dbeafe;
    padding:11px 18px;
    border-radius:50px;
    font-weight:600;
    transition:.25s;
}

.home-btn:hover{
    background:#2563eb;
    color:white;
}

.search-area{
    padding:18px 22px;
    border-bottom:1px solid #edf2f7;
}

.search{
    width:100%;
    padding:15px 18px;
    border-radius:16px;
    border:none;
    outline:none;
    background:#f8fafc;
    color:#334155;
    font-size:15px;
}

.search::placeholder{
    color:#94a3b8;
}

.users{
    display:flex;
    flex-direction:column;
}

.user-link{
    text-decoration:none;
}

.user-card{
    display:flex;
    align-items:center;
    gap:15px;
    padding:18px 22px;
    transition:.25s;
    border-bottom:1px solid #f1f5f9;
}

.user-card:hover{
    background:#f8fbff;
}

.avatar-wrapper{
    position:relative;
}

.avatar{
    width:58px;
    height:58px;
    border-radius:50%;
    background:linear-gradient(135deg,#3b82f6,#60a5fa);
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:22px;
    font-weight:700;
    overflow:hidden;
}

.avatar img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.online-dot{
    width:13px;
    height:13px;
    border-radius:50%;
    background:#22c55e;
    border:2px solid white;
    position:absolute;
    right:2px;
    bottom:2px;
}

.offline-dot{
    width:13px;
    height:13px;
    border-radius:50%;
    background:#cbd5e1;
    border:2px solid white;
    position:absolute;
    right:2px;
    bottom:2px;
}

.user-info{
    flex:1;
    min-width:0;
}

.username{
    color:#0f172a;
    font-weight:700;
    font-size:17px;
}

.last-message{
    color:#64748b;
    font-size:14px;
    margin-top:4px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}

.right{
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:8px;
}

.time{
    font-size:12px;
    color:#94a3b8;
}

.unread{
    min-width:23px;
    height:23px;
    border-radius:50%;
    background:#2563eb;
    color:white;
    font-size:12px;
    font-weight:700;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:0 6px;
}

.loader{
    margin:70px auto;
    width:55px;
    height:55px;
    border-radius:50%;
    border:5px solid #dbeafe;
    border-top-color:#2563eb;
    animation:spin 1s linear infinite;
}

@keyframes spin{
    to{
        transform:rotate(360deg);
    }
}

.empty{
    text-align:center;
    padding:80px 20px;
    color:#64748b;
}

.empty h3{
    margin-top:15px;
    color:#334155;
}

@media(max-width:768px){

    .chat-page{
        padding:0;
    }

    .glass{
        border-radius:0;
        min-height:100vh;
    }

    .top-bar{
        padding:18px;
    }

    .title{
        font-size:22px;
    }

    .subtitle{
        display:none;
    }

    .user-card{
        padding:15px;
    }

    .avatar{
        width:52px;
        height:52px;
    }

}

`}</style>

      <div className="chat-page">
        <div className="glass">
          <div className="top-bar">
            <div>
              <div className="title">💬 Pulli Chat</div>
              <div className="subtitle">Chat with your friends</div>
            </div>

            <Link to="/" className="home-btn">
              🏠 Home
            </Link>
          </div>

          <div className="search-area">
            <input
              className="search"
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loader"></div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty">
              <div style={{ fontSize: 60 }}>💬</div>

              <h3>No Conversations</h3>

              <p>Start chatting with your friends.</p>
            </div>
          ) : (
            <div className="users">
              {filteredUsers.map((u) => (
                <Link key={u._id} to={`/chat/${u._id}`} className="user-link">
                  <div className="user-card">
                    {/* Profile Picture */}

                    <div className="avatar-wrapper">
                      {u.avatar ? (
                        <div className="avatar">
                          <img src={u.avatar} alt={u.username} />
                        </div>
                      ) : (
                        <div className="avatar">{getAvatar(u.username)}</div>
                      )}

                      {onlineUsers.has(u._id) ? (
                        <div className="online-dot"></div>
                      ) : (
                        <div className="offline-dot"></div>
                      )}
                    </div>

                    {/* Username + Last Message */}

                    <div className="user-info">
                      <div className="username">{u.username}</div>

                      <div className="last-message">
                        {u.lastMessage ? u.lastMessage : "Start chatting..."}
                      </div>
                    </div>

                    {/* Time + Unread */}

                    <div className="right">
                      <div className="time">
                        {formatTime(u.lastMessageTime)}
                      </div>

                      {u.unreadCount > 0 && (
                        <div className="unread">{u.unreadCount}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatListPage;
