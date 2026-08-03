import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useAuth();

  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");

  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const friend = chat?.users?.find((u) => u._id !== user?._id) || null;

  const scrollBottom = (smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  const loadChat = async () => {
    try {
      const res = await api.get(`/chats/${userId}`);
      setChat(res.data);
      await api.patch(`/chats/${res.data._id}/messages/seen`);

      if (user?._id) {
        socket.emit("join", user._id);
      }

      const friendUser = res.data.users.find((u) => u._id === userId);

      if (friendUser) {
        setOnline(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    loadChat();
  }, [userId, user]);

  useEffect(() => {
    if (!chat) return;

    const timer = setTimeout(() => {
      scrollBottom(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [chat]);

  useEffect(() => {
    if (!chat?._id || !user?._id) return;

    const receiveMessage = (message) => {
      if (message.chatId !== chat._id) return;

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));

      setTimeout(() => scrollBottom(true), 100);

      if (message.sender?._id !== user._id) {
        api;
        api.patch(`/chats/${chat._id}/messages/seen`).catch(console.error);
      }
    };

    const handleTypingStart = ({ from }) => {
      if (from === userId) {
        setTyping(true);
      }
    };

    const handleTypingStop = ({ from }) => {
      if (from === userId) {
        setTyping(false);
      }
    };

    const handleUserOnline = (id) => {
      if (id === userId) {
        setOnline(true);
      }
    };

    const handleUserOffline = ({ userId: id }) => {
      if (id === userId) {
        setOnline(false);
      }
    };

    socket.on("receiveMessage", receiveMessage);
    socket.on("typing", handleTypingStart);
    socket.on("stopTyping", handleTypingStop);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("receiveMessage", receiveMessage);
      socket.off("typing", handleTypingStart);
      socket.off("stopTyping", handleTypingStop);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [chat, user, userId]);

  const handleTyping = (value) => {
    setText(value);

    socket.emit("typing", {
      from: user._id,
      to: userId,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        from: user._id,
        to: userId,
      });
    }, 800);
  };
  const sendMessage = async () => {
    if (!text.trim() || !chat) return;

    try {
      const { data } = await api.post(`/chats/${chat._id}/messages`, {
        text,
      });

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));

      socket.emit("sendMessage", {
        ...data,
        chatId: chat._id,
        to: userId,
      });

      socket.emit("stopTyping", {
        from: user._id,
        to: userId,
      });

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (message) => {
    setEditingMessage(message._id);
    setEditText(message.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const { data } = await api.patch(
        `/chats/${chat._id}/messages/${editingMessage}/edit`,
        {
          text: editText,
        },
      );

      setChat((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m._id === editingMessage ? data : m,
        ),
      }));

      setEditingMessage(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { data } = await api.delete(
        `/chats/${chat._id}/messages/${messageId}`,
      );

      setChat((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m._id === messageId ? data : m)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!chat) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Loading Chat...
      </div>
    );
  }

  return (
    <>
      <style>{`
      *{
  box-sizing:border-box;
}

.chat-page{
  min-height:calc(100vh - 80px);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:20px;
  background:#eef2ff;
}

.glass{
  width:100%;
  max-width:1100px;
  height:calc(100vh - 120px);
  display:flex;
  flex-direction:column;
  background:rgba(255,255,255,.75);
  backdrop-filter:blur(18px);
  border-radius:24px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.45);
  box-shadow:0 15px 40px rgba(0,0,0,.10);
}

.chat-header{
  flex-shrink:0;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 22px;
  background:#fff;
  border-bottom:1px solid #e5e7eb;
}

.header-left{
  display:flex;
  align-items:center;
  gap:14px;
}

.back-btn{
  width:42px;
  height:42px;
  border-radius:50%;
  display:flex;
  justify-content:center;
  align-items:center;
  text-decoration:none;
  font-size:20px;
  color:#2563eb;
  background:#fff;
  transition:.25s;
}

.back-btn:hover{
  transform:translateX(-3px);
}

.avatar{
  width:52px;
  height:52px;
  border-radius:50%;
  object-fit:cover;
  background:#ddd;
}

.avatar-placeholder{
  width:52px;
  height:52px;
  border-radius:50%;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#2563eb;
  color:#fff;
  font-size:22px;
  font-weight:700;
}

.name{
  font-size:19px;
  font-weight:700;
  color:#111827;
}

.status{
  font-size:13px;
  color:#6b7280;
  margin-top:3px;
}

.messages{
  flex:1;
  overflow-y:auto;
  overflow-x:hidden;
  padding:20px;
  display:flex;
  flex-direction:column;
  gap:12px;
  background:#eef2ff;
}

.messages::-webkit-scrollbar{
  width:5px;
}

.messages::-webkit-scrollbar-thumb{
  background:#cbd5e1;
  border-radius:20px;
}

.row{
  display:flex;
  width:100%;
}

.me{
  justify-content:flex-end;
}

.other{
  justify-content:flex-start;
}

.bubble{
  max-width:72%;
  padding:12px 15px;
  border-radius:18px;
  word-break:break-word;
  overflow-wrap:anywhere;
  position:relative;
}

.bubble.me{
  background:#2563eb;
  color:#fff;
  border-bottom-right-radius:6px;
}

.bubble.other{
  background:#fff;
  color:#111827;
  border:1px solid #e5e7eb;
  border-bottom-left-radius:6px;
}

.message-time{
  margin-top:8px;
  font-size:11px;
  opacity:.75;
  text-align:right;
}

.edited{
  margin-left:6px;
  font-size:10px;
  font-style:italic;
}

.message-actions{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:8px;
  flex-wrap:wrap;
}

.action-btn{
  border:none;
  background:transparent;
  cursor:pointer;
  font-size:13px;
  color:inherit;
  opacity:.8;
}

.action-btn:hover{
  opacity:1;
}

.typing{
  font-size:13px;
  color:#6b7280;
  padding-left:10px;
}

.chat-input{
  flex-shrink:0;
  padding:18px;
  border-top:1px solid rgba(0,0,0,.08);
  background:rgba(255,255,255,.35);
}

.chat-input-row{
  display:flex;
  align-items:center;
  gap:12px;
}

.chat-input-field{
  flex:1;
  padding:14px 18px;
  border-radius:30px;
  border:1px solid #d1d5db;
  outline:none;
  font-size:15px;
  background:#fff;
  color:#111827;
}

.send-btn{
  width:52px;
  height:52px;
  border-radius:50%;
  border:none;
  cursor:pointer;
  background:#2563eb;
  color:#fff;
  font-size:20px;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-shrink:0;
}

@media (max-width:768px){

  .glass{
    height:100vh;
    max-width:100%;
    border-radius:0;
  }

  .chat-header{
    padding:15px;
  }

  .messages{
    padding:15px;
  }

  .bubble{
    max-width:88%;
    font-size:14px;
  }

  .avatar,
  .avatar-placeholder{
    width:46px;
    height:46px;
    font-size:18px;
  }

  .name{
    font-size:17px;
  }

}

@media (max-width:500px){

  .bubble{
    max-width:95%;
  }

  .back-btn{
    width:38px;
    height:38px;
  }

  .message-actions{
    gap:8px;
  }

  .chat-input{
    padding:12px;
  }

`}</style>

      <div className="chat-page">
        <div className="glass">
          <div className="chat-header">
            <div className="header-left">
              <Link to="/chat" className="back-btn" title="Back">
                ←
              </Link>

              {friend?.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend?.username}
                  className="avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  {friend?.username?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div>
                <div className="name">{friend?.username}</div>

                <div className="status">
                  {typing ? "Typing..." : online ? "🟢 Online" : "⚪ Offline"}
                </div>
              </div>
            </div>

            <div className="header-right">
              {/* Future Voice / Video buttons */}
            </div>
          </div>
          <div className="messages">
            {chat.messages.map((message) => {
              const isMe = message.sender?._id === user._id;

              return (
                <div
                  key={message._id}
                  className={`row ${isMe ? "me" : "other"}`}
                >
                  <div className={`bubble ${isMe ? "me" : "other"}`}>
                    {editingMessage === message._id ? (
                      <>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            marginBottom: "10px",
                          }}
                        />

                        <div className="message-actions">
                          <button className="action-btn" onClick={saveEdit}>
                            💾 Save
                          </button>

                          <button
                            className="action-btn"
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText("");
                            }}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {message.deleted ? (
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              lineHeight: "1.5",
                            }}
                          >
                            🚫 This message was deleted
                          </div>
                        ) : message.type === "shared_post" ? (
                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                marginBottom: "10px",
                              }}
                            >
                              📤 Shared a post
                            </div>

                            {message.sharedPost?.media &&
                              (message.sharedPost.mediaType === "image" ? (
                                <img
                                  src={message.sharedPost.media}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    borderRadius: "12px",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <video
                                  src={message.sharedPost.media}
                                  controls
                                  style={{
                                    width: "100%",
                                    borderRadius: "12px",
                                    marginBottom: "10px",
                                  }}
                                />
                              ))}

                            {message.sharedPost?.text && (
                              <div
                                style={{
                                  marginBottom: "10px",
                                }}
                              >
                                {message.sharedPost.text}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                              lineHeight: "1.5",
                            }}
                          >
                            {message.text}
                          </div>
                        )}

                        <div className="message-time">
                          {message.createdAt &&
                            new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}

                          {message.edited && (
                            <span className="edited"> (edited)</span>
                          )}

                          {isMe && (
                            <span
                              style={{
                                marginLeft: 8,
                                fontSize: 11,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {message.seen ? "✓✓ Seen" : "✓ Sent"}
                            </span>
                          )}
                        </div>

                        {!message.deleted && isMe && (
                          <div className="message-actions">
                            <button
                              className="action-btn"
                              onClick={() => startEdit(message)}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              className="action-btn"
                              onClick={() => deleteMessage(message._id)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="typing">{friend?.username} is typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input-field"
                value={text}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
              />

              <button className="send-btn" onClick={sendMessage} title="Send">
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
